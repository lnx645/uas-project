import api from "@/utils/axios";
import { useEffect, useState } from "react";


export const usePolledData = (endpoint : string, intervalTime = 30000) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(endpoint);
        setData(response.data);
      } catch (error) {
        console.error(`Gagal mengambil data dari ${endpoint}:`, error);
      }
    };

    fetchData(); 
    const intervalId = setInterval(fetchData, intervalTime);
    return () => clearInterval(intervalId);
  }, [endpoint, intervalTime]);

  return [data];
};

export const useActiveUsers = () => {
  return usePolledData("/api/users/active"); 
};

export const useTopUsersWeekly = () => {
  return usePolledData("/api/users/active_this_week");
};

export const useTopTags = ()=>{
  return usePolledData("/api/popular-tags");
}