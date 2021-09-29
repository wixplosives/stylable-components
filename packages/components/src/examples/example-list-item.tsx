import type { ListItemProps } from '../list/list';
import {classes, style} from './example-list-item.st.css'
export interface ItemData {
  title: string;
  id: string;
}

export const exampleListItem = ({ data: { title }, id,isFocused, isSelected }: ListItemProps<ItemData>): JSX.Element => {
  return <div data-id={id} className={style(classes.root, {
    focused:isFocused,
    selected: isSelected
  })}>{title}</div>;
};
