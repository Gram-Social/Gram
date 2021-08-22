'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';
import { getAccessToken, getAppToken, parseBaseURL } from 'soapbox/utils/auth';
import { createSelector } from 'reselect';

export const getLinks = response => {
  const value = response.headers.link;
  if (!value) return { refs: [] };
  return LinkHeader.parse(value);
};

export const getNext = response => {
  const links = getLinks(response);
  const link = links.refs.find(link => link.rel === 'next');
  return link ? link.uri : null;
};

const getToken = (state, authType) => {
  return authType === 'app' ? getAppToken(state) : getAccessToken(state);
};

const maybeParseJSON = data => {
  try {
    return JSON.parse(data);
  } catch(Exception) {
    return data;
  }
};

const getAuthBaseURL = createSelector([
  (state, me) => state.getIn(['accounts', me, 'url']),
  (state, me) => state.getIn(['auth', 'me']),
], (accountUrl, authUserUrl) => {
  const baseURL = parseBaseURL(accountUrl) || parseBaseURL(authUserUrl);
  return baseURL !== window.location.origin ? baseURL : '';
});

export const baseClient = (accessToken, baseURL = '') => {
  return axios.create({
    baseURL,
    headers: Object.assign(accessToken ? {
      'Authorization': `Bearer ${accessToken}`,
    } : {}),

    transformResponse: [maybeParseJSON],
  });
};

export default (getState, authType = 'user') => {
  const state = getState();
  const accessToken = getToken(state, authType);
  const me = state.get('me');
  const baseURL = getAuthBaseURL(state, me);

  return baseClient(accessToken, baseURL);
};
