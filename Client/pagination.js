export default class paginationManager {
    constructor(parentElement, loadPageHandler) {
        this.parentElement = parentElement;
        this.controlDiv = this._findOrAppendElementOfClass('pagination-control', 'div', parentElement, (element) => {
            const style = document.createElement('style');
            style.textContent = defaulControlStyling;
            element.appendChild(style);
        });
        this.prev = this._findOrAppendElementOfClass('prev-button', 'button', this.controlDiv, (element) => {
            element.innerHTML = '&lt;';
        });

        this.pageInfoDiv = this._findOrAppendElementOfClass('page-info', 'div', this.controlDiv);
        
        this.currentPageSpan = this._findOrAppendElementOfClass('current-page-info', 'span', this.pageInfoDiv, (element) => {
            this.pageInfoDiv.appendChild(document.createTextNode('Page '));
        });
        this.totalPageSpan = this._findOrAppendElementOfClass('total-page-info', 'span', this.pageInfoDiv, (element) => {
            this.pageInfoDiv.appendChild(document.createTextNode(' of '));
        });

        this.next = this._findOrAppendElementOfClass('next-button', 'button', this.controlDiv, (element) => {
            element.innerHTML = '&gt;';
        });
        

        this.itemInfoDiv = this._findOrAppendElementOfClass('item-count-info', 'div', parentElement, (element) => {
            const style = document.createElement('style');
            style.textContent = defaultItemInfoStyling;
            element.appendChild(style);

            element.appendChild(document.createTextNode('Showing '));
        });
        this.itemCount =  this._findOrAppendElementOfClass('item-count', 'span', this.itemInfoDiv)
        this.totalItemCount = this._findOrAppendElementOfClass('total-item-count', 'span', this.itemInfoDiv, (element) => {
            this.itemInfoDiv.appendChild(document.createTextNode(' of '));
        });
        
        this.currentPage = 1;

        this.pageUpdateHandler = loadPageHandler;
        this.next.addEventListener('click', () => {
            loadPageHandler(this.currentPage + 1);
        });

        this.prev.addEventListener('click', () => {
            loadPageHandler(this.currentPage - 1);
        });

    }

    callLoadPageHandler(page = this.currentPage) {
        this.currentPage = page;
        this.pageUpdateHandler(page);
    }

    updatePaginationValues(showing, total, page, totalPages) {

        this.itemCount.textContent = showing;
        this.totalItemCount.textContent = total;
        
        this.currentPage = page;
        this.currentPageSpan.textContent = page;
        this.totalPageSpan.textContent = totalPages;

        this.next.disabled = page == totalPages;
        this.prev.disabled = page <= 1;
    }

    _findOrAppendElementOfClass(className, elementType, parentElement, createHandler = (element)=>{})
    {
        let element = this.parentElement.querySelector(`.${className}`);
        if(!element) element = this._appendElementWithClass(elementType, className, parentElement, createHandler)
        return element;
    }
    _appendElementWithClass(elementType, className, parentElement, createHandler = (element)=>{}){
        const element = document.createElement(elementType);
        element.className = className;
        createHandler(element);
        parentElement.appendChild(element);
        return element;
    }
}
const defaulControlStyling = `
    .pagination-control {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1% 0;
        gap: 10px;
    }

    .pagination-control button {
        padding: 8px 12px;
        background-color: #ff9900;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .pagination-control button:hover:not(:disabled) {
        background-color: #e68a00;
    }

    .pagination-control button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`

const defaultItemInfoStyling = `
.item-count-info {
    text-align: center;
    margin: 0%;
    font-size: 1em;
    color: #555;
}

`