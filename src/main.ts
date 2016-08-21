import { debounce } from 'lodash';

function clearChildren(e: Element) {
    e.innerHTML = '';
}

function createChildren(results: any[], parent: Element) {
    results.forEach(result => createElement(result, parent));
}

function createElement(text: string, parent: Element) {
    const liEl = document.createElement('li');
    liEl.innerHTML = text;
    parent.appendChild(liEl);
}

// Begin

// flatMapLatest
let previousXhr: XMLHttpRequest | undefined;
const makeGetRequest = (url: string) => {
    // flatMapLatest
    if (previousXhr) previousXhr.abort();
    const xhr = new XMLHttpRequest();
    // flatMapLatest
    previousXhr = xhr;
    xhr.open('GET', url, true);
    xhr.send();
    return new Promise<XMLHttpRequest>((resolve, reject) => {
        xhr.onload = () => resolve(xhr);
        xhr.onerror = () => reject(xhr);
    });
}

const searchWikipedia = (term: string) => {
    const url = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
        + encodeURIComponent(term) + '&origin=*';
    return makeGetRequest(url)
        .then(xhr => JSON.parse(xhr.response))
        .then(response => response[1]);
};

// distinctUntilChanged
let previousValue: string | undefined;
const ulEl = document.querySelector('ul');
const search = (value: string) => {
    // distinctUntilChanged
    if (value !== previousValue) {
        return searchWikipedia(value)
    }
    // distinctUntilChanged
    previousValue = value;
}

const searchAndRender = (value: string) => {
    const promise = search(value);
    // distinctUntilChanged
    if (promise) {
        promise.then(
            results => {
                clearChildren(ulEl);
                createChildren(results, ulEl);
            }, (error: XMLHttpRequest) => {
                clearChildren(ulEl);
                createElement('Error: ' + error.response, ulEl);
            }
        )
    }
}

const debouncedSearchAndRender = debounce(searchAndRender, 500);

const keyupFn = (event: KeyboardEvent) => {
    // map
    const value = (event.target as HTMLInputElement).value
    // filter
    if (value.length > 2) {
        // debounce
        debouncedSearchAndRender(value);
    }
};

const inputEl = document.querySelector('input');
inputEl.addEventListener('keyup', keyupFn)
