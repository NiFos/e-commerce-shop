import Axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { ITag } from '../../pages/admin/products/tags';
import { RootState } from '../store';

const axiosInstance = Axios.create({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const tagsReducerTypes = {
  getTags: 'tags/GET_TAGS',
  createTag: 'tags/CREATE_TAGS',
  getTagsLoadingStatus: 'tags/GET_TAGS_LOADING_STATUS',
  createLoadingStatus: 'tags/CREATE_LOADING_STATUS',
};
export interface ITagsReducer {
  tags?: ITag[];
  createLoadingStatus?: 'loading' | 'error' | 'loaded';
  getTagsLoadingStatus?: 'loading' | 'error' | 'loaded';
}
const initialState: ITagsReducer = {};

/**
 * Tags reducer
 */
export const tagsReducer = (
  state = initialState,
  { type, payload }: TagsAction
): ITagsReducer => {
  switch (type) {
    case tagsReducerTypes.getTags: {
      return {
        ...state,
        tags: payload as ITag[],
      };
    }

    case tagsReducerTypes.createTag: {
      const newState = [...(state.tags || [])];
      newState.push(...(payload as ITag[]));

      return {
        ...state,
        tags: newState as ITag[],
      };
    }

    case tagsReducerTypes.getTagsLoadingStatus: {
      return {
        ...state,
        getTagsLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    case tagsReducerTypes.createLoadingStatus: {
      return {
        ...state,
        createLoadingStatus: payload as 'loading' | 'loaded' | 'error',
      };
    }

    default: {
      return state;
    }
  }
};

// Actions
interface GetTagsAction {
  type: typeof tagsReducerTypes.getTags;
  payload: ITag[];
}

/**
 * Get tags action
 */
export const getTags = (): ThunkAction<
  void,
  RootState,
  unknown,
  TagsAction
> => async (dispatch) => {
  try {
    dispatch({
      type: tagsReducerTypes.getTagsLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.get('/api/admin/products/gettags');
    dispatch({
      type: tagsReducerTypes.getTags,
      payload: [...response.data.tags],
    });
    dispatch({
      type: tagsReducerTypes.getTagsLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: tagsReducerTypes.getTagsLoadingStatus,
      payload: 'error',
    });
  }
};

interface CreateTagAction {
  type: typeof tagsReducerTypes.createTag;
  payload: ITag[];
}

interface CreateTagLoadingStatusACtion {
  type: typeof tagsReducerTypes.createLoadingStatus;
  payload: 'loading' | 'loaded' | 'error';
}

/**
 * Create tag action
 * @param title - product title
 */
export const createTag = (
  title: string
): ThunkAction<void, RootState, unknown, TagsAction> => async (dispatch) => {
  try {
    dispatch({
      type: tagsReducerTypes.createLoadingStatus,
      payload: 'loading',
    });
    const response = await axiosInstance.post('/api/admin/products/tagcreate', {
      title,
    });
    dispatch({
      type: tagsReducerTypes.createTag,
      payload: response.data,
    });
    dispatch({
      type: tagsReducerTypes.createLoadingStatus,
      payload: 'loaded',
    });
  } catch (error) {
    dispatch({
      type: tagsReducerTypes.createLoadingStatus,
      payload: 'error',
    });
  }
};

export type TagsAction =
  | CreateTagAction
  | GetTagsAction
  | CreateTagLoadingStatusACtion;
