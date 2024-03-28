import { CheckerIcon } from './CheckerIcon';
import { OffCheckerIcon } from './OffCheckerIcon';
import { RedoIcon } from './RedoIcon';
import { UndoIcon } from './UndoIcon';
import { IconProps, IconType } from './types';

interface IProps extends IconProps {
  type: IconType;
}

function getComponent(type: IconType) {
  switch (type) {
    case 'Checker': {
      return CheckerIcon;
    }
    case 'OffChecker': {
      return OffCheckerIcon;
    }
    case 'Redo': {
      return RedoIcon;
    }
    case 'Undo': {
      return UndoIcon;
    }
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unknown icon type: "${type}".`);
    }
  }
}

export function Icon(props: IProps) {
  const { type, width, height, fill } = props;

  const IconComponent = getComponent(type);

  return <IconComponent width={width} height={height} fill={fill} />;
}
