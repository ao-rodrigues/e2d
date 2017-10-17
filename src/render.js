

//Transform points function
import transformPoints from "./transformPoints";
import cycleMouseData from "./cycleMouseData";
import Pi2 from "./Pi2";
import transformOperation from "./transformOperation";
import setTransformOperation from "./setTransformOperation";
import scaleOperation from "./scaleOperation";
import translateOperation from "./translateOperation";
import rotateOperation from "./rotateOperation";
import skewXOperation from  "./skewXOperation";
import skewYOperation from "./skewYOperation";
import createVirtualStack from "./createVirtualStack";

//Initialize all the properties
const identity = [ 1, 0, 0, 1, 0, 0 ],
  empty = [],
  concat = [].concat;

const relativeTransforms = {
  transform: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true
};

const upTransforms = {
  transform: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true,
  setTransform: true
};

const render = ( ...args ) => {
  let children = args.slice( 0, -1 ),
    isTransformDirty = true,
    transformStackIndex = 6,
    transformStack = new Float64Array( 501 * 6 ),
    cache;

  transformStack.set( identity );

  const ctx = args[ args.length - 1 ];

  cycleMouseData( ctx );

  const matrix = new Float64Array( identity ),
    regions = ctx.canvas[ Symbol.for( "regions" ) ] = [],
    mousePoints = ctx.canvas[ Symbol.for( "mousePoints" ) ] = [],
    extensions = ctx.canvas[ Symbol.for( "extensions" ) ];

  const stack = createVirtualStack();

  transformStack[ 0 ] = identity[ 0 ];
  transformStack[ 1 ] = identity[ 1 ];
  transformStack[ 2 ] = identity[ 2 ];
  transformStack[ 3 ] = identity[ 3 ];
  transformStack[ 4 ] = identity[ 4 ];
  transformStack[ 5 ] = identity[ 5 ];

  const increaseTransformStackSize = () => {
    cache = transformStack;
    transformStack = new Float64Array( transformStack.length + 600 ); //Add 100 more
    transformStack.set( cache );
  };

  let len = children.length;

  //Flatten children during the loop process to save time
  for ( let i = 0; i < len; i++ ) {
    let child = children[ i ];

    //Used to detect if item is an array. Array.isArray is too slow
    if ( child && child.constructor === Array ) {
      children = concat.apply( empty, children );
      child = children[ i ];

      //Repeat as necessary
      while ( child && child.constructor === Array ) {
        children = concat.apply( empty, children );
        child = children[ i ];
      }

      //Used to reset the length.
      len = children.length;
    }

    //Child must be truthy
    if ( !child ) {
      continue;
    }

    //Child is an instruction at this point, retrieve the props.
    const { props, type } = child;

    //If the transform is relative, then we store the current transform state in matrix.
    if ( relativeTransforms[ type ] ) {
      matrix[ 0 ] = transformStack[ transformStackIndex - 6 ];
      matrix[ 1 ] = transformStack[ transformStackIndex - 5 ];
      matrix[ 2 ] = transformStack[ transformStackIndex - 4 ];
      matrix[ 3 ] = transformStack[ transformStackIndex - 3 ];
      matrix[ 4 ] = transformStack[ transformStackIndex - 2 ];
      matrix[ 5 ] = transformStack[ transformStackIndex - 1 ];
    }

    if ( upTransforms[ type ] ) {

      //Increase the index
      transformStackIndex += 6;

      //We are changing the state of the stack, set the dirty flag
      isTransformDirty = true;
      if ( transformStackIndex >= transformStack.length ) {
        increaseTransformStackSize();
      }
    }

    switch ( type ) {
      case "transform":
        transformOperation( transformStack, transformStackIndex, matrix, props );
        continue;

      case "setTransform":
        setTransformOperation( transformStack, transformStackIndex, props );
        continue;

      case "scale":
        scaleOperation( transformStack, transformStackIndex, matrix, props );
        continue;

      case "translate":
        translateOperation( transformStack, transformStackIndex, matrix, props );
        continue;

      case "rotate":
        rotateOperation( transformStack, transformStackIndex, matrix, props );
        continue;

      case "skewX":
        skewXOperation( transformStack, transformStackIndex, matrix, props );
        continue;

      case "skewY":
        skewYOperation( transformStack, transformStackIndex, matrix, props );
        continue;

      case "restore":
        transformStackIndex -= 6;
        isTransformDirty = true;
        continue;
    }

    if ( isTransformDirty ) {
      isTransformDirty = false;
      ctx.setTransform(
        transformStack[ transformStackIndex - 6 ],
        transformStack[ transformStackIndex - 5 ],
        transformStack[ transformStackIndex - 4 ],
        transformStack[ transformStackIndex - 3 ],
        transformStack[ transformStackIndex - 2 ],
        transformStack[ transformStackIndex - 1 ]
      );
    }

    switch ( type ) {
      case "push":
        stack[ props.stack ].push(
          props.stack === "lineDash" ? ctx.getLineDash() : ctx[ props.stack ]
        );

        if ( props.stack === "globalAlpha" ) {
          ctx[ props.stack ] *= props.value;
        } else if ( props.stack === "lineDash" ) {
          ctx.setLineDash( props.value ) ;
        } else {
          ctx[ props.stack ] = props.value;
        }
        continue;

      case "pop":
        if ( props.stack === "lineDash" ) {
          ctx.setLineDash( stack.lineDash.pop() );
          continue;
        }

        ctx[ props.stack ] = stack[ props.stack ].pop();
        continue;

      case "call":
        const { name, args, count } = props;
        switch ( count ) {
          case 0:
            ctx[ name ]();
            continue;
          case 1:
            ctx[ name ]( args[ 0 ] );
            continue;
          case 2:
            ctx[ name ]( args[ 0 ], args[ 1 ] );
            continue;
          case 3:
            ctx[ name ]( args[ 0 ], args[ 1 ], args[ 2 ] );
            continue;
          case 4:
            ctx[ name ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ] );
            continue;
          case 5:
            ctx[ name ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ] );
            continue;
          case 6:
            ctx[ name ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ] );
            continue;
          case 7:
            ctx[ name ](
              args[ 0 ],
              args[ 1 ],
              args[ 2 ],
              args[ 3 ],
              args[ 4 ],
              args[ 5 ],
              args[ 6 ]
            );
            continue;
          case 8:
            ctx[ name ](
              args[ 0 ],
              args[ 1 ],
              args[ 2 ],
              args[ 3 ],
              args[ 4 ],
              args[ 5 ],
              args[ 6 ],
              args[ 7 ]
            );
            continue;
          case 9:
            ctx[ name ](
              args[ 0 ],
              args[ 1 ],
              args[ 2 ],
              args[ 3 ],
              args[ 4 ],
              args[ 5 ],
              args[ 6 ],
              args[ 7 ],
              args[ 8 ]
            );
            continue;
        }

      case "strokeArc":
        ctx.beginPath();
        ctx.arc( props[ 0 ], props[ 1 ], props[ 2 ], props[ 3 ], props[ 4 ], props[ 5 ] );
        ctx.stroke();
        continue;

      case "fillArc":
        ctx.beginPath();
        ctx.arc( props[ 0 ], props[ 1 ], props[ 2 ], props[ 3 ], props[ 4 ], props[ 5 ] );
        ctx.fill();
        continue;

      case "hitRect":
      case "hitRegion":
      case "hitCircle":
        if ( regions ) {
          regions.push( {
            id: props.id,
            points: props.points,
            matrix: [
              transformStack[ transformStackIndex - 6 ],
              transformStack[ transformStackIndex - 5 ],
              transformStack[ transformStackIndex - 4 ],
              transformStack[ transformStackIndex - 3 ],
              transformStack[ transformStackIndex - 2 ],
              transformStack[ transformStackIndex - 1 ]
            ],
            type, //Hit type goes here
            hover: false,
            touched: false,
            clicked: false
          } );
        }
        continue;

      default:
        if ( extensions && extensions[ type ] ) {
          extensions[ type ]( props, ctx );
        }
        continue;
    }
  }
};

export default render;
