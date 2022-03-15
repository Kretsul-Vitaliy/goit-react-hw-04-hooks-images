function FetchPixabayAPISearch(name, page) {
  const URL = "https://pixabay.com/api/";
  const API_KEY = "24457855-696bd2eff11a5d8607ee7122f";

  return fetch(
    `${URL}?q=${name}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      new Error("Ошибка сервера, невозможно получить JSON")
    );
  });
}
export default FetchPixabayAPISearch;
