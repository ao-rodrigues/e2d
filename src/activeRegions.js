import transformPoints from "./transformPoints";
import invertMatrix from "./invertMatrix";
import pointInRect from "./pointInRect";
import pointInCircle from "./pointInCircle";

import pointInPolygon from "point-in-polygon";

const matrix = new Float64Array( 6 ),
  alwaysFalse = () => false;

const activeRegions = ( ctx ) => {
  const regions = ctx.canvas[ Symbol.for( "regions" ) ],
    mousePoints = ctx.canvas[ Symbol.for( "mousePoints" ) ],
    mouseData = ctx.canvas[ Symbol.for( "mouseData" ) ],
    results = {};

  //The mouse might have held still, add the current mouse position to make the data consistent
  if ( mousePoints.length === 0 ) {
    mousePoints.push( [ mouseData.x, mouseData.y, mouseData.state ] );
  }

  for ( const region of regions ) {

    //Invert the region matrix and transform the mouse points
    const transformedMousePoints = transformPoints( mousePoints, invertMatrix( region.matrix ) );

    //The mouse points are now relative to the mouse region, use the appropriate test
    const test = region.type === "hitRect" ? pointInRect :
      region.type === "hitRegion" ? pointInPolygon :
      region.type === "hitCircle" ? pointInCircle :
      alwaysFalse;
    for ( const mousePoint of transformedMousePoints ) {
      if ( test( mousePoint, region.points ) ) {
        region.hover = true;
        region.clicked = !!mouseData.clicked;
        results[ region.id ] = region;
        break;
      }
    }
  }
  return results;
};

export default activeRegions;
