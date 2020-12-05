import {
  Button,
  CircularProgress,
  Input,
  List,
  ListItem,
} from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { createTag, getTags } from '../redux/reducers/tags';
import i18n from '../../i18n';

export interface ITag {
  tag_id: number;
  title: string;
}

interface Props {
  selectHandler: (name: 'tags', value: number) => void;
  selected: number[];
}

/**
 * Tags component
 */
export function Tags(props: Props): JSX.Element {
  const [value, setValue] = React.useState('');
  const { t } = i18n.useTranslation('admin');
  const state = useSelector((state: RootState) => state.tags);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTags());
  }, []);

  /**
   * Create new tag handler
   */
  function submitHandler() {
    dispatch(createTag(value));
    setValue('');
  }

  /**
   * Render all tags
   */
  function renderAllTags() {
    return (state.tags || []).map((item) => {
      return (
        <ListItem
          key={item.tag_id}
          onClick={() => props.selectHandler('tags', item.tag_id)}
        >
          <Checkbox
            checked={props.selected.includes(item.tag_id)}
            onChange={() => props.selectHandler('tags', item.tag_id)}
          />
          {item.title}
        </ListItem>
      );
    });
  }
  return (
    <div>
      <span>{t('admin:products-page.tags.new-tag')} </span>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />{' '}
      <Button onClick={submitHandler}>{t('admin:create')}</Button>
      {state.getTagsLoadingStatus === 'loaded' ? (
        <List>{state.tags && renderAllTags()}</List>
      ) : state.getTagsLoadingStatus === 'loading' ? (
        <CircularProgress />
      ) : state.getTagsLoadingStatus === 'error' ? (
        <div>{t('admin:error')}</div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
