export const routeList = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LIBRARY: '/library',
  ALBUMS: '/library/albums',
  ALBUM: '/library/albums/:id',
  ARTISTS: '/library/artists',
  ARTIST: '/library/artists/:id',
  SONGS: '/library/songs',
  PLAYLISTS: '/library/playlists',
  PLAYLIST: '/library/playlists/:id',
  GENRES: '/library/genres',
  GENRE: '/library/genres/:id',
  RADIOS: '/library/radios',
  RADIO: '/library/radios/:id',
  SEARCH: '/search',
  SETTINGS: '/settings',
  FAVORITES: '/favorites',
  NOWPLAYING: '/nowplaying',
} as const;

export type RoutePath = (typeof routeList)[keyof typeof routeList];
