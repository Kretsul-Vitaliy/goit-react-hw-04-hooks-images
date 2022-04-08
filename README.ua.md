**Читати іншими мовами: [Русский](README.md), [Українська](README.ua.md).**

# Пошук зображень

Напиши застосунок пошуку зображень за ключовим словом. Прев'ю робочого застосунку [дивись за посиланням](https://drive.google.com/file/d/1oXCGyiq4uKwW0zzraZLKk4lh3voBlBzZ/view?usp=sharing).

Створи компоненти `<Searchbar>`, `<ImageGallery>`, `<ImageGalleryItem>`,
`<Loader>`, `<Button>` і `<Modal>`. Готові стилі компонентів можна взяти у файлі [styles.css](./styles.css) і підправити під себе, якщо потрібно.

![preview](./mockup/preview.jpg)

## Інструкція Pixabay API

Для HTTP-запитів використовуй публічний сервіс пошуку зображень [Pixabay](https://pixabay.com/api/docs/). Зареєструйся та отримай приватний ключ доступу.

URL-рядок HTTP-запиту.

```bash
https://pixabay.com/api/?q=cat&page=1&key=your_key&image_type=photo&orientation=horizontal&per_page=12
```

Pixabay API підтримує пагінацію, за замовчуванням параметр `page` дорівнює `1`. Нехай у відповіді надходить по 12 об'єктів, встановлено в параметрі `per_page`. Не забудь, що під час пошуку за новим ключовим словом, необхідно скидати значення `page` до `1`.

У відповіді від апі приходить масив об'єктів, в яких тобі цікаві лише наступні властивості.

- `id` – унікальний ідентифікатор
- `webformatURL` – посилання на маленьке зображення для списку карток
- `largeImageURL` – посилання на велике зображення для модального вікна

## Опис компонента `<Searchbar>`

Компонент приймає один проп `onSubmit` – функцію для передачі значення інпута під час сабміту форми. Створює DOM-елемент наступної структури.

```html
<header class="searchbar">
  <form class="form">
    <button type="submit" class="button">
      <span class="button-label">Search</span>
    </button>

    <input
      class="input"
      type="text"
      autocomplete="off"
      autofocus
      placeholder="Search images and photos"
    />
  </form>
</header>
```

## Опис компонента `<ImageGallery>`

Список карток зображень. Створює DOM-елемент наступної структури.

```html
<ul class="gallery">
  <!-- Набір <li> із зображеннями -->
</ul>
```

## Опис компонента `<ImageGalleryItem>`

Компонент елемента списку із зображенням. Створює DOM-елемент наступної структури.

```html
<li class="gallery-item">
  <img src="" alt="" />
</li>
```

## Опис компонента `<Button>`

При натисканні на кнопку `Load more` повинна довантажуватись наступна порція зображень і рендеритися разом із попередніми. Кнопка повинна рендеритися лише тоді, коли є якісь завантажені зображення. Якщо масив зображень порожній, кнопка не рендериться.

## Опис компонента `<Loader>`

Компонент спінера відображається, доки відбувається завантаження зображень. Використовуйте будь-який готовий компонент, наприклад [react-loader-spinner](https://github.com/mhnpd/react-loader-spinner) або будь-який інший.

## Опис компонента `<Modal>`

Під час кліку на елемент галереї повинно відкриватися модальне вікно з темним оверлеєм і відображатися велика версія зображення. Модальне вікно повинно закриватися по натисканню клавіші `ESC` або по кліку на оверлеї.

Зовнішній вигляд схожий на функціонал цього [VanillaJS-плагіна](https://basiclightbox.electerious.com/), тільки замість білого модального вікна рендериться зображення (у прикладі натисніть `Run`). Анімацію робити не потрібно!

```html
<div class="overlay">
  <div class="modal">
    <img src="" alt="" />
  </div>
</div>
```

async componentDidUpdate(prevProps, prevState) {
const PrevName = prevState.searchQuery;
const NextName = this.state.searchQuery;
const PerPage = this.state.perPage;
const NextPage = this.state.page;
const PrevPage = prevState.page;

    try {
      if (PrevName !== NextName) {
        await this.setState({
          searchImageArray: [],
          page: NextPage,
          perPage: PerPage,
          showLoader: true,
        });
        await this.searchPictures();
        toast.success(
          await `Найдено ${this.state.totalHits} изображений ${NextName}`,
          { delay: 200 }
        );
      }
      if (NextPage !== PrevPage && NextPage !== 1) {
        await this.setState({
          perPage: PerPage,
          showLoader: true,
        });
        await this.searchPictures();
        await window.scrollBy({

          top: 550,
          behavior: "smooth",
        });
        if (this.state.searchImageArray.length >= this.state.totalHits) {
          return await toast.info(
            `Сожалеем, но вы достигли конца списка \n результатов поиска по ${NextName}.`
          );
        }
      }
    } catch (error) {

    }

}
searchPictures = async () => {
const NextName = this.state.searchQuery;
const NextPage = this.state.page;
const PerPage = this.state.perPage;
const PicturesArray = FetchPixabayAPI(NextName, NextPage, PerPage);

    await PicturesArray.then((resolve) => {
      const picturesArray = resolve.hits.map(
        ({ id, tags, webformatURL, largeImageURL }) => {
          return { id, tags, webformatURL, largeImageURL };
        }
      );

      //второй вариант записи с одним setState
      this.setState((prevState) => {
        return {
          status: "resolved",
          showLoader: false,
          searchImageArray: [...prevState.searchImageArray, ...picturesArray],
          error: null,
          // resolve.totalHits - переменная количества найденных фото для API это максимальное количество
          totalHits: resolve.totalHits,
          totalPages: Math.ceil(resolve.totalHits / PerPage), //получаем общее количество страниц
        };
      });

      if (picturesArray.length === 0) {
        // return toast.error("There is no picture with that name!");
        return Promise.reject(new Error(`Try another name: ${NextName}`));
      }
    }).catch((error) =>
      this.setState({ status: "rejected", error: error.message })
    );

};

//Метод записи в state, применили для записи в App из SearchBar то что записали в input и нажали на кнопку отправить
handleSearchBarSubmit = async (event, prevState) => {
await event.preventDefault();
await this.setState({
searchQuery: event.target.searchQuery.value,
page: 1,
modalImage: "",
});

    if (this.state.searchQuery === "") {
      await toast.error("Введите имя");
      return;
    }

    event.target.reset();

};

handleSelect = (event) => {
this.setState({ perPage: event.value });
};

// метод добавления page в state из предыдущего стейта +1
handleLoadMoreButton = async () => {
try {
await this.setState((prevState) => {
return { page: prevState.page + 1 };
});
} catch (error) {}
};
//метод открытия закрытия модального окна
toggleModal = () => {
this.setState((state) => ({ isModalOpen: !state.isModalOpen }));
};

openLargeImage = (event) => {
if (event.target.nodeName !== "IMG") {
return;
}
this.setState({ modalImage: event.target.dataset.source });
this.toggleModal();
};

//Метод записи в state, применили для записи в App из SearchBar то что записали в input и нажали на кнопку отправить
handleSearchBarSubmit = async (event, prevState) => {
await event.preventDefault();
await this.setState({
searchQuery: event.target.searchQuery.value,
page: 1,
modalImage: "",
});

    if (this.state.searchQuery === "") {
      await toast.error("Введите имя");
      return;
    }

    event.target.reset();

};
