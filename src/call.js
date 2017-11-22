function call(ctx, instruction) {
  switch (instruction.props.count) {
    case 0:
      return ctx[instruction.props.name]();
    case 1:
      return ctx[instruction.props.name](instruction.props.args[0]);
    case 2:
      return ctx[instruction.props.name](instruction.props.args[0], instruction.props.args[1]);
    case 3:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
      );
    case 4:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
      );
    case 5:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
      );
    case 6:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
      );
    case 7:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
        instruction.props.args[6],
      );
    case 8:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
        instruction.props.args[6],
        instruction.props.args[7],
      );
    case 9:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
        instruction.props.args[6],
        instruction.props.args[7],
        instruction.props.args[8],
      );
  }
}

export default call;
