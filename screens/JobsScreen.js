import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { saveBookmark, getBookmarks } from '../store/bookmarksStore';

const BASE_URL = 'https://testapi.getlokalapp.com/common/jobs?page=';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [page, setPage] = useState(1); 
  const [bookmarks, setBookmarks] = useState([]); 

 
  const fetchJobList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${page}`);
      console.log('Full API Response:', response); 
      console.log('Response Data:', response.data); 

     
      const data = response.data.results || []; 

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format'); 
      }

      if (data.length === 0) {
        console.warn('No jobs found on page:', page); 
      }

      setJobs((prevJobs) => [...prevJobs, ...data]); 
      setLoading(false); 
    } catch (err) {
      console.error('Fetch Error:', err); 
      setError('Failed to load jobs');
      setLoading(false); 
    }
  };

 
  const loadBookmarks = async () => {
    const storedBookmarks = await getBookmarks();
    setBookmarks(storedBookmarks || []); 
  };

  
  const handleBookmark = async (job) => {
    const updatedBookmarks = [...bookmarks, job]; 
    setBookmarks(updatedBookmarks); 
    await saveBookmark(updatedBookmarks); 
  };

  
  useEffect(() => {
    fetchJobList();
    loadBookmarks(); 
  }, [page]); 


  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  
  if (error) return <Text style={styles.error}>{error}</Text>;

  if (jobs.length === 0 && !loading) {
    return <Text style={styles.noData}>No jobs found!</Text>;
  }

 
  return (
    <View style={styles.container}>
      <FlatList
        data={jobs || []} 
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <JobCard item={item} onBookmark={handleBookmark} />
        )}
        onEndReached={() => setPage(page + 1)} 
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setPage(1); 
              setJobs([]);
              fetchJobList();
            }}
          />
        }
      />
    </View>
  );
};


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
