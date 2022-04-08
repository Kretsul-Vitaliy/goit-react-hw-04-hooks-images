import { useState, useEffect } from "react";

const useAxiosAPI = (configObj) => {
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);
  const [result, setResult] = useState([]);
  const [reload, setReload] = useState([0]);

  const refetch = () => setReload((prev) => prev + 1);
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const { axiosInstance, method, url, requestConfig = {} } = configObj;
        const response = await axiosInstance[method.toLowerCase()](url, {
          ...requestConfig,
          signal: controller.signal,
        });
        console.log(response);
        const data = await response.data;
        // console.log("response", data);
        setResult(data);
        //   return data; //возвращаем ответ с данными запроса! Результатом всей ассинхронной функции будет Promise!!!
      } catch (error) {
        setError(error.message);
        if (error.response) {
          // Когда код состояния ответа выходит за пределы диапазона 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          //Когда не был получен ответ после того, как запрос был сделан
          console.log(error.request);
        } else {
          // Ошибка
          console.log(error.message);
        }
      } finally {
        setloading(false);
      }
    };
    fetchData();
    console.log("EFFECT");
    console.log("refetch");
    // useEffect cleanup function
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);
  return { result, error, loading, refetch };
};

export default useAxiosAPI;
