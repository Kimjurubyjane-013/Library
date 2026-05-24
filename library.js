// ── Data ──────────────────────────────────────────────
const library = [];
let activeFilter = 'all';

function Book(title, author, pages, read) {
  this.id     = crypto.randomUUID();
  this.title  = title;
  this.author = author;
  this.pages  = pages;
  this.read   = read;
}

// ── DOM refs ──────────────────────────────────────────
const addBookBtn   = document.getElementById('addBookBtn');
const modalOverlay = document.getElementById('modalOverlay');
const submitBtn    = document.getElementById('submitBtn');
const errorMsg     = document.getElementById('errorMsg');
const bookDisplay  = document.getElementById('bookDisplay');
const emptyState   = document.getElementById('emptyState');
const filterBar    = document.getElementById('filterBar');
const bookCountEl  = document.getElementById('bookCount');
const titleInput   = document.getElementById('bookTitle');
const authorInput  = document.getElementById('bookAuthor');
const pagesInput   = document.getElementById('pages');
const readInput    = document.getElementById('readStatus');

// ── Modal helpers ─────────────────────────────────────
function openModal() {
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  titleInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  clearForm();
  errorMsg.textContent = '';
}

function clearForm() {
  titleInput.value  = '';
  authorInput.value = '';
  pagesInput.value  = '';
  readInput.checked = false;
}

// ── Event: open/close modal ───────────────────────────
addBookBtn.addEventListener('click', openModal);

document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('cancelBtn2').addEventListener('click', closeModal);

// Close on backdrop click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

// ── Event: submit ─────────────────────────────────────
submitBtn.addEventListener('click', () => {
  const title  = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pages  = parseInt(pagesInput.value, 10);
  const read   = readInput.checked;

  if (!title || !author) {
    errorMsg.textContent = 'Title and author are required.';
    (!title ? titleInput : authorInput).focus();
    return;
  }

  const book = new Book(title, author, isNaN(pages) || pages < 1 ? null : pages, read);
  library.push(book);
  renderBooks();
  closeModal();
});

// Allow Enter key to submit from inputs
[titleInput, authorInput, pagesInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn.click();
  });
});

// ── Event: filter ─────────────────────────────────────
filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  filterBar.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b === btn);
  });
  renderBooks();
});

// ── Render ────────────────────────────────────────────
function renderBooks() {
  // Update header count
  bookCountEl.textContent = `${library.length} book${library.length !== 1 ? 's' : ''}`;

  // Show/hide filter bar & empty state
  const hasBooks = library.length > 0;
  filterBar.hidden   = !hasBooks;
  emptyState.hidden  = hasBooks;

  // Filter
  const filtered = library.filter(book => {
    if (activeFilter === 'read')   return book.read;
    if (activeFilter === 'unread') return !book.read;
    return true;
  });

  // Use DocumentFragment for a single DOM write
  const fragment = document.createDocumentFragment();

  filtered.forEach((book, idx) => {
    const card = buildCard(book, idx);
    fragment.appendChild(card);
  });

  bookDisplay.innerHTML = '';
  bookDisplay.appendChild(fragment);
}

function buildCard(book, idx) {
  const card = document.createElement('article');
  card.className = 'book-card';
  card.style.animationDelay = `${idx * 40}ms`;
  card.dataset.id = book.id;

  card.innerHTML = `
    <span class="card-spine">Book</span>
    <h2 class="card-title">${escapeHtml(book.title)}</h2>
    <p class="card-author">${escapeHtml(book.author)}</p>
    <div class="card-meta">
      <span class="card-pages">${book.pages ? book.pages + ' pages' : 'Pages N/A'}</span>
      <span class="card-badge ${book.read ? 'read' : 'unread'}">${book.read ? 'Read' : 'Unread'}</span>
    </div>
    <div class="card-divider"></div>
    <div class="card-actions">
      <button class="toggle-btn" data-action="toggle" aria-label="Toggle read status">
        Mark ${book.read ? 'unread' : 'read'}
      </button>
      <button class="remove-btn" data-action="remove" aria-label="Remove book">Remove</button>
    </div>
  `;

  card.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'remove') {
      removeBook(book.id);
    } else if (btn.dataset.action === 'toggle') {
      toggleRead(book.id);
    }
  });

  return card;
}

// ── Book actions ──────────────────────────────────────
function removeBook(id) {
  const idx = library.findIndex(b => b.id === id);
  if (idx === -1) return;

  // Animate out before removing
  const card = bookDisplay.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.transition = 'opacity .2s, transform .2s';
    card.style.opacity = '0';
    card.style.transform = 'scale(.95)';
    setTimeout(() => {
      library.splice(idx, 1);
      renderBooks();
    }, 200);
  } else {
    library.splice(idx, 1);
    renderBooks();
  }
}

function toggleRead(id) {
  const book = library.find(b => b.id === id);
  if (!book) return;
  book.read = !book.read;
  renderBooks();
}

// ── Utility ───────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────────────
renderBooks();