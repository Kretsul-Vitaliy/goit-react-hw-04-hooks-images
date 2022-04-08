import axios from "axios";

async function FetchPixabayAPI(searchQuery, page, perPage) {
  try {
    const response = await axios({
      method: "get",
      baseURL: "https://pixabay.com/api/",
      timeout: 3000, // 5 секунд тайм-аута
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      // },
      params: {
        key: process.env.REACT_APP_PIXABAY_API_KEY,
        q: `${searchQuery}`,
        page: `${page}`,
        image_type: "photo",
        orientation: "horizontal",
        per_page: `${perPage}`,
        safesearch: true,
      },
    });
    const data = await response.data;
    // console.log("response", data);
    return data; //возвращаем ответ с данными запроса! Результатом всей ассинхронной функции будет Promise!!!
  } catch (error) {
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
  }
}

export default FetchPixabayAPI;

// async function FetchPixabayAPISearch(name, page) {
//   const URL = "https://pixabay.com/api/";
//   const API_KEY = "24457855-696bd2eff11a5d8607ee7122f";
//   const controller = new AbortController();
//   const signal = controller.signal;
//   const options = {
//     // method: "POST",
//     signal: signal,
//     // body: JSON.stringify({
//     //   firstName: "Sabesan",
//     //   lastName: "Sathananthan",
//     // }),
//   };
//   try {
//     // const timeoutId = setTimeout(() => controller.abort(), 5000);
//     setTimeout(() => controller.abort(), 1000);
//     const response = await fetch(
//       `${URL}?q=${name}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`,
//       options
//     );
//     if (response.ok) {
//       return response.json();
//     }
//   } catch (error) {
//     Promise.reject(new Error("Ошибка сервера, невозможно получить JSON"));
//     // console.error("Ошибка сервера, невозможно получить данные", error);
//   }
// }
// export default FetchPixabayAPISearch;

// axios({
//   method: "post",
//   url: "/login",
//   timeout: 5000, // 5 секунд тайм-аута
//   data: {
//     firstName: "Sabesan",
//     lastName: "Sathananthan",
//   },
// })
//   .then((response) => {
//     /* заголовок ответа */
//   })
//   .catch((error) => console.error("timeout exceeded"));
