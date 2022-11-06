const searchWrapper = document.querySelector('.search-input');
const inputBox = searchWrapper.querySelector('.input');
const searchBox = searchWrapper.querySelector('.search-list');
const searchItemRepo = searchWrapper.querySelector('.list-item');
const repoList = document.querySelector('.repo-list');
const repoItem = repoList.querySelectorAll('.repo-item');

function debounce(fn, debounceTime) {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
}

function createElement(tag, classElement) {
  const element = document.createElement(tag);
  if (classElement) element.classList.add(classElement);
  return element;
}

function serachUsers(e) {
  let repositoriesData = e.target.value;
  if (repositoriesData) {
    return fetch(
      `https://api.github.com/search/repositories?q=${repositoriesData}&per_page=5`
    ).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          searchBox.innerHTML = '';
          res.items.forEach((repositories) => {
            const listTag = createElement('li', 'list-item');
            listTag.innerHTML = repositories.name;
            searchBox.appendChild(listTag);
            listTag.addEventListener('click', () => {
              const listTagAdd = createElement('li', 'repo-item');
              listTagAdd.innerHTML = `Name: ${repositories.name}<br>Owner: ${repositories.owner.login}<br>Stars: ${repositories.stargazers_count}`;
              repoList.appendChild(listTagAdd);

              const listTagListRemove = createElement('span', 'repo-remove');
              listTagAdd.appendChild(listTagListRemove);
              listTagListRemove.addEventListener('click', () => {
                listTagAdd.remove();
              });
              inputBox.value = '';
              searchBox.innerHTML = '';
            });
          });
        });
      } else {
        console.error('Error');
      }
    });
  } else {
    repositoriesData = '';
    searchBox.innerHTML = '';
  }
}

searchWrapper.addEventListener('keyup', debounce(serachUsers, 1000));
