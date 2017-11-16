const call = (ctx, { props: { name, args, count } }) => {
  switch (count) {
    case 0:
      ctx[name]();
      break;
    case 1:
      ctx[name](args[0]);
      break;
    case 2:
      ctx[name](args[0], args[1]);
      break;
    case 3:
      ctx[name](args[0], args[1], args[2]);
      break;
    case 4:
      ctx[name](args[0], args[1], args[2], args[3]);
      break;
    case 5:
      ctx[name](args[0], args[1], args[2], args[3], args[4]);
      break;
    case 6:
      ctx[name](args[0], args[1], args[2], args[3], args[4], args[5]);
      break;
    case 7:
      ctx[name](args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      break;
    case 8:
      ctx[name](
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5],
        args[6],
        args[7]
      );
      break;
    case 9:
      ctx[name](
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5],
        args[6],
        args[7],
        args[8]
      );
      break;
  }
};

export default call;
