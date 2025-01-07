import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveBookmark = async (bookmarks) => {
  await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

export const getBookmarks = async () => {
  const storedBookmarks = await AsyncStorage.getItem('bookmarks');
  return storedBookmarks ? JSON.parse(storedBookmarks) : [];
};
