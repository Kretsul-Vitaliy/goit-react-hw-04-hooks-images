function FetchPixabay(name) {
  const API_KEY = "24457855-696bd2eff11a5d8607ee7122f";
  return fetch(
    `https://pixabay.com/api/?q=${name}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
    // return Promise.reject(new Error(`Нет картинки с таким именем ${name}`));
  });
}
export default FetchPixabay;
