import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { saveBookmark, getBookmarks } from '../store/bookmarksStore';

const BASE_URL = 'https://testapi.getlokalapp.com/common/jobs?page=';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]); // Job list state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [page, setPage] = useState(1); // Start with page 1
  const [bookmarks, setBookmarks] = useState([]); // Bookmarks state

  // Fetch jobs from API
  const fetchJobList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${page}`);
      console.log('Full API Response:', response); // Debug full response
      console.log('Response Data:', response.data); // Debug actual data

      // Extract data and validate
      const data = response.data.results || []; // Handle empty results safely

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format'); // Handle invalid response
      }

      if (data.length === 0) {
        console.warn('No jobs found on page:', page); // Log empty results
      }

      setJobs((prevJobs) => [...prevJobs, ...data]); // Append jobs
      setLoading(false); // Stop loading
    } catch (err) {
      console.error('Fetch Error:', err); // Log errors
      setError('Failed to load jobs'); // Set error state
      setLoading(false); // Stop loading
    }
  };

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    const storedBookmarks = await getBookmarks();
    setBookmarks(storedBookmarks || []); // Fallback to an empty array if no bookmarks
  };

  // Handle bookmarking jobs
  const handleBookmark = async (job) => {
    const updatedBookmarks = [...bookmarks, job]; // Add job to bookmarks
    setBookmarks(updatedBookmarks); // Update state
    await saveBookmark(updatedBookmarks); // Save to AsyncStorage
  };

  // Initial load
  useEffect(() => {
    fetchJobList(); // Fetch jobs
    loadBookmarks(); // Load bookmarks
  }, [page]); // Re-run when page changes

  // Render loading indicator
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  // Render error message
  if (error) return <Text style={styles.error}>{error}</Text>;

  // Render empty state message
  if (jobs.length === 0 && !loading) {
    return <Text style={styles.noData}>No jobs found!</Text>;
  }

  // Render job list
  return (
    <View style={styles.container}>
      <FlatList
        data={jobs || []} // Fallback to an empty array
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Generate unique key
        renderItem={({ item }) => (
          <JobCard item={item} onBookmark={handleBookmark} />
        )}
        onEndReached={() => setPage(page + 1)} // Load more data when end is reached
        onEndReachedThreshold={0.5} // Trigger loading slightly before the end
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setPage(1); // Reset page
              setJobs([]); // Clear jobs
              fetchJobList(); // Reload data
            }}
          />
        }
      />
    </View>
  );
};

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default JobsScreen;
