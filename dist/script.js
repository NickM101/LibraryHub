class LibrarySystem {
    constructor() {
        this.books = [];
        this.members = [];
        this.transactions = [];
        this.initializeData();
        this.setupEventListeners();
        this.setupThemeToggle();
    }
    initializeData() {
        this.books = this.getSampleBooks();
        this.members = this.getSampleMembers();
        this.transactions = this.getSampleTransactions();
    }
    getSampleBooks() {
        return [
            {
                id: 'B001',
                title: 'Dune',
                author: 'Frank Herbert',
                isbn: '978-0-441-17271-9',
                category: 'Science Fiction',
                status: 'borrowed',
                borrowedBy: 'M001',
                borrowedDate: new Date('2024-06-01'),
                dueDate: new Date('2024-06-15')
            },
            {
                id: 'B002',
                title: 'The Twilight Saga: Twilight',
                author: 'Stephenie Meyer',
                isbn: '978-0-316-01584-4',
                category: 'Romance',
                status: 'available',
                borrowedBy: null,
                borrowedDate: null,
                dueDate: null
            },
            {
                id: 'B003',
                title: 'The Lord of the Rings: The Fellowship of the Ring',
                author: 'J.R.R. Tolkien',
                isbn: '978-0-547-92822-7',
                category: 'Fantasy',
                status: 'available',
                borrowedBy: null,
                borrowedDate: null,
                dueDate: null
            },
            {
                id: 'B004',
                title: 'Harry Potter and the Philosopher\'s Stone',
                author: 'J.K. Rowling',
                isbn: '978-0-7475-3269-9',
                category: 'Fantasy',
                status: 'available',
                borrowedBy: null,
                borrowedDate: null,
                dueDate: null
            },
            {
                id: 'B005',
                title: 'The Hunger Games',
                author: 'Suzanne Collins',
                isbn: '978-0-439-02348-1',
                category: 'Science Fiction',
                status: 'borrowed',
                borrowedBy: 'M002',
                borrowedDate: new Date('2024-05-28'),
                dueDate: new Date('2024-06-18')
            }
        ];
    }
    getSampleMembers() {
        return [
            {
                id: 'M001',
                name: 'Emma Watson',
                email: 'emma.watson@email.com',
                phone: '+1-555-0123',
                type: 'Faculty',
                borrowedBooks: ['B001'],
                joinDate: new Date('2024-01-15')
            },
            {
                id: 'M002',
                name: 'Ryan Gosling',
                email: 'ryan.gosling@email.com',
                phone: '+1-555-0456',
                type: 'Student',
                borrowedBooks: ['B005'],
                joinDate: new Date('2024-03-10')
            },
            {
                id: 'M003',
                name: 'Zendaya Coleman',
                email: 'zendaya.coleman@email.com',
                phone: '+1-555-0789',
                type: 'Regular',
                borrowedBooks: [],
                joinDate: new Date('2024-05-20')
            },
            {
                id: 'M004',
                name: 'Tom Holland',
                email: 'tom.holland@email.com',
                phone: '+1-555-0321',
                type: 'Student',
                borrowedBooks: [],
                joinDate: new Date('2024-04-05')
            }
        ];
    }
    getSampleTransactions() {
        return [
            {
                id: 'T001',
                memberId: 'M001',
                bookId: 'B001',
                type: 'borrow',
                date: new Date('2024-06-01'),
                dueDate: new Date('2024-06-15'),
                status: 'active'
            },
            {
                id: 'T002',
                memberId: 'M002',
                bookId: 'B005',
                type: 'borrow',
                date: new Date('2024-05-28'),
                dueDate: new Date('2024-06-18'),
                status: 'active'
            },
            {
                id: 'T003',
                memberId: 'M003',
                bookId: 'B002',
                type: 'borrow',
                date: new Date('2024-05-20'),
                dueDate: new Date('2024-06-03'),
                status: 'completed'
            },
            {
                id: 'T004',
                memberId: 'M003',
                bookId: 'B002',
                type: 'return',
                date: new Date('2024-06-03'),
                dueDate: null,
                status: 'completed'
            }
        ];
    }
    setupEventListeners() {
        const bookForm = document.getElementById('bookForm');
        const memberForm = document.getElementById('memberForm');
        const transactionForm = document.getElementById('transactionForm');
        if (bookForm) {
            bookForm.addEventListener('submit', (e) => this.handleBookSubmit(e));
        }
        if (memberForm) {
            memberForm.addEventListener('submit', (e) => this.handleMemberSubmit(e));
        }
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        }
    }
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle === null || themeToggle === void 0 ? void 0 : themeToggle.querySelector('.theme-icon');
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    generateId(prefix) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${prefix}${timestamp}${random}`.toUpperCase();
    }
    getElement(id) {
        return document.getElementById(id);
    }
    getInputValue(id) {
        const element = this.getElement(id);
        return element ? element.value.trim() : '';
    }
    getSelectValue(id) {
        const element = this.getElement(id);
        return element ? element.value : '';
    }
    addBook(bookData) {
        const book = Object.assign(Object.assign({ id: this.generateId('B') }, bookData), { status: 'available', borrowedBy: null, borrowedDate: null, dueDate: null });
        this.books.push(book);
        this.addActivity('Book Added', `"${book.title}" by ${book.author}`, 'added');
        return book;
    }
    getBook(id) {
        return this.books.find(book => book.id === id) || null;
    }
    updateBook(id, updates) {
        const bookIndex = this.books.findIndex(book => book.id === id);
        if (bookIndex === -1)
            return null;
        this.books[bookIndex] = Object.assign(Object.assign({}, this.books[bookIndex]), updates);
        return this.books[bookIndex];
    }
    deleteBook(id) {
        const book = this.getBook(id);
        if (!book)
            return false;
        if (book.status === 'borrowed') {
            alert('Cannot delete a book that is currently borrowed. Please return the book first.');
            return false;
        }
        const bookIndex = this.books.findIndex(b => b.id === id);
        this.books.splice(bookIndex, 1);
        this.members.forEach(member => {
            member.borrowedBooks = member.borrowedBooks.filter(bookId => bookId !== id);
        });
        this.addActivity('Book Deleted', `"${book.title}" by ${book.author}`, 'deleted');
        return true;
    }
    getAllBooks() {
        return [...this.books];
    }
    getAvailableBooks() {
        return this.books.filter(book => book.status === 'available');
    }
    addMember(memberData) {
        const member = Object.assign(Object.assign({ id: this.generateId('M') }, memberData), { borrowedBooks: [], joinDate: new Date() });
        this.members.push(member);
        this.addActivity('New Member', member.name, 'registered');
        return member;
    }
    getMember(id) {
        return this.members.find(member => member.id === id) || null;
    }
    updateMember(id, updates) {
        const memberIndex = this.members.findIndex(member => member.id === id);
        if (memberIndex === -1)
            return null;
        this.members[memberIndex] = Object.assign(Object.assign({}, this.members[memberIndex]), updates);
        return this.members[memberIndex];
    }
    deleteMember(id) {
        const member = this.getMember(id);
        if (!member)
            return false;
        if (member.borrowedBooks.length > 0) {
            const hasOverdueBooks = member.borrowedBooks.some(bookId => {
                const book = this.getBook(bookId);
                return book && book.dueDate && new Date() > book.dueDate;
            });
            if (hasOverdueBooks) {
                alert('Cannot delete member with overdue books. Please return all books first.');
                return false;
            }
            member.borrowedBooks.forEach(bookId => {
                this.returnBook(bookId, id);
            });
        }
        const memberIndex = this.members.findIndex(m => m.id === id);
        this.members.splice(memberIndex, 1);
        this.addActivity('Member Deleted', member.name, 'deleted');
        return true;
    }
    getAllMembers() {
        return [...this.members];
    }
    findMemberByEmail(email) {
        return this.members.find(member => member.email === email) || null;
    }
    borrowBook(bookId, memberId) {
        const book = this.getBook(bookId);
        const member = this.getMember(memberId);
        if (!book || !member)
            return false;
        if (book.status !== 'available') {
            alert('This book is not available for borrowing.');
            return false;
        }
        const borrowLimit = this.getBorrowLimit(member.type);
        if (member.borrowedBooks.length >= borrowLimit) {
            alert(`Member has reached borrowing limit (${borrowLimit} books).`);
            return false;
        }
        const borrowPeriod = this.getBorrowPeriod(member.type);
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + borrowPeriod);
        book.status = 'borrowed';
        book.borrowedBy = memberId;
        book.borrowedDate = new Date();
        book.dueDate = dueDate;
        member.borrowedBooks.push(bookId);
        const transaction = {
            id: this.generateId('T'),
            memberId,
            bookId,
            type: 'borrow',
            date: new Date(),
            dueDate,
            status: 'active'
        };
        this.transactions.push(transaction);
        this.addActivity('Book Borrowed', `${member.name} - "${book.title}"`, 'borrowed');
        return true;
    }
    returnBook(bookId, memberId) {
        const book = this.getBook(bookId);
        const member = this.getMember(memberId);
        if (!book || !member)
            return false;
        if (book.status !== 'borrowed' || book.borrowedBy !== memberId) {
            alert('This book is not borrowed by this member.');
            return false;
        }
        book.status = 'available';
        book.borrowedBy = null;
        book.borrowedDate = null;
        book.dueDate = null;
        member.borrowedBooks = member.borrowedBooks.filter(id => id !== bookId);
        const activeTransaction = this.transactions.find(t => t.bookId === bookId && t.memberId === memberId && t.status === 'active');
        if (activeTransaction) {
            activeTransaction.status = 'completed';
        }
        const transaction = {
            id: this.generateId('T'),
            memberId,
            bookId,
            type: 'return',
            date: new Date(),
            dueDate: null,
            status: 'completed'
        };
        this.transactions.push(transaction);
        this.addActivity('Book Returned', `${member.name} - "${book.title}"`, 'returned');
        return true;
    }
    getAllTransactions() {
        return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    getActiveTransactions() {
        return this.transactions.filter(t => t.status === 'active');
    }
    getOverdueTransactions() {
        const now = new Date();
        return this.transactions.filter(t => t.status === 'active' && t.dueDate && now > t.dueDate);
    }
    getBorrowLimit(memberType) {
        return LibrarySystem.BORROW_LIMITS[memberType];
    }
    getBorrowPeriod(memberType) {
        return LibrarySystem.BORROW_PERIODS[memberType];
    }
    addActivity(type, description, status) {
        const activities = this.getRecentActivities();
        activities.unshift({
            time: new Date(),
            type,
            description,
            status
        });
        if (activities.length > 10) {
            activities.splice(10);
        }
        this.renderRecentActivities();
    }
    getRecentActivities() {
        if (!window.recentActivities) {
            window.recentActivities = [];
        }
        return window.recentActivities;
    }
    handleBookSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const editId = form.dataset.editId;
        const title = this.getInputValue('bookTitle');
        const author = this.getInputValue('bookAuthor');
        const isbn = this.getInputValue('bookISBN');
        const category = this.getSelectValue('bookCategory');
        if (!title || !author) {
            alert('Title and Author are required.');
            return;
        }
        if (editId) {
            this.updateBook(editId, { title, author, isbn, category });
            this.addActivity('Book Updated', `"${title}" by ${author}`, 'added');
        }
        else {
            this.addBook({ title, author, isbn, category });
        }
        this.clearBookForm();
        this.renderBooks();
        this.updateStats();
        this.updateDropdowns();
        const accordion = document.querySelector('.accordion-trigger.active');
        if (accordion)
            this.toggleAccordion(accordion);
    }
    handleMemberSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const editId = form.dataset.editId;
        const name = this.getInputValue('memberName');
        const email = this.getInputValue('memberEmail');
        const phone = this.getInputValue('memberPhone');
        const type = this.getSelectValue('memberType');
        if (!name || !email) {
            alert('Name and Email are required.');
            return;
        }
        if (!editId && this.findMemberByEmail(email)) {
            alert('A member with this email already exists.');
            return;
        }
        if (editId) {
            this.updateMember(editId, { name, email, phone, type });
            this.addActivity('Member Updated', name, 'registered');
        }
        else {
            this.addMember({ name, email, phone, type });
        }
        this.clearMemberForm();
        this.renderMembers();
        this.updateStats();
        this.updateDropdowns();
        const accordion = document.querySelector('.accordion-trigger.active');
        if (accordion)
            this.toggleAccordion(accordion);
    }
    handleTransactionSubmit(event) {
        event.preventDefault();
        const memberId = this.getSelectValue('transactionMember');
        const bookId = this.getSelectValue('transactionBook');
        const type = this.getSelectValue('transactionType');
        if (!memberId || !bookId || !type) {
            alert('All fields are required.');
            return;
        }
        let success = false;
        if (type === 'borrow') {
            success = this.borrowBook(bookId, memberId);
        }
        else if (type === 'return') {
            success = this.returnBook(bookId, memberId);
        }
        if (success) {
            const form = this.getElement('transactionForm');
            if (form)
                form.reset();
            this.renderAll();
            this.updateStats();
            this.updateDropdowns();
            const accordion = document.querySelector('.accordion-trigger.active');
            if (accordion)
                this.toggleAccordion(accordion);
        }
    }
    renderBooks() {
        const tbody = this.getElement('booksTableBody');
        if (!tbody)
            return;
        tbody.innerHTML = this.books.map(book => `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category || 'N/A'}</td>
                <td><span class="status-badge status-${book.status}">${book.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="library.editBook('${book.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="library.confirmDeleteBook('${book.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    renderMembers() {
        const tbody = this.getElement('membersTableBody');
        if (!tbody)
            return;
        tbody.innerHTML = this.members.map(member => `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.type}</td>
                <td>${member.borrowedBooks.length}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="library.editMember('${member.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="library.confirmDeleteMember('${member.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    renderTransactions() {
        const tbody = this.getElement('transactionsTableBody');
        if (!tbody)
            return;
        const recentTransactions = this.getAllTransactions().slice(0, 20);
        tbody.innerHTML = recentTransactions.map(transaction => {
            const member = this.getMember(transaction.memberId);
            const book = this.getBook(transaction.bookId);
            const memberName = member ? member.name : 'Unknown Member';
            const bookTitle = book ? book.title : 'Unknown Book';
            return `
                <tr>
                    <td>${transaction.date.toLocaleDateString()}</td>
                    <td>${memberName}</td>
                    <td>${bookTitle}</td>
                    <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                    <td>${transaction.dueDate ? transaction.dueDate.toLocaleDateString() : '-'}</td>
                    <td><span class="status-badge status-${transaction.status === 'active' ? 'borrowed' : 'available'}">${transaction.status}</span></td>
                </tr>
            `;
        }).join('');
    }
    renderRecentActivities() {
        const tbody = this.getElement('recentActivitiesBody');
        if (!tbody)
            return;
        const activities = this.getRecentActivities().slice(0, 5);
        if (activities.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                        No recent activities. Start by adding books or members!
                    </td>
                </tr>
            `;
            return;
        }
        tbody.innerHTML = activities.map(activity => {
            const timeAgo = this.getTimeAgo(activity.time);
            const statusClass = this.getActivityStatusClass(activity.status);
            return `
                <tr>
                    <td>${timeAgo}</td>
                    <td>${activity.type}</td>
                    <td>${activity.description}</td>
                    <td><span class="status-badge status-${statusClass}">${activity.status}</span></td>
                </tr>
            `;
        }).join('');
    }
    getActivityStatusClass(status) {
        const statusMap = {
            'borrowed': 'borrowed',
            'returned': 'available',
            'registered': 'available',
            'added': 'available',
            'deleted': 'borrowed'
        };
        return statusMap[status] || 'available';
    }
    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1)
            return 'Just now';
        if (diffMins < 60)
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24)
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    updateStats() {
        const totalBooks = this.books.length;
        const availableBooks = this.getAvailableBooks().length;
        const totalMembers = this.members.length;
        const borrowedBooks = this.books.filter(book => book.status === 'borrowed').length;
        const setElementText = (id, text) => {
            const element = this.getElement(id);
            if (element)
                element.textContent = text;
        };
        setElementText('totalBooks', totalBooks.toString());
        setElementText('availableBooks', availableBooks.toString());
        setElementText('totalMembers', totalMembers.toString());
        setElementText('borrowedBooks', borrowedBooks.toString());
    }
    updateDropdowns() {
        const memberSelect = this.getElement('transactionMember');
        if (memberSelect) {
            memberSelect.innerHTML = '<option value="">Choose Member</option>' +
                this.members.map(member => `<option value="${member.id}">${member.name}</option>`).join('');
        }
        const bookSelect = this.getElement('transactionBook');
        if (bookSelect) {
            bookSelect.innerHTML = '<option value="">Choose Book</option>' +
                this.books.map(book => `<option value="${book.id}">${book.title} (${book.status})</option>`).join('');
        }
    }
    editBook(id) {
        const book = this.getBook(id);
        if (!book)
            return;
        const setInputValue = (inputId, value) => {
            const input = this.getElement(inputId);
            if (input)
                input.value = value;
        };
        setInputValue('bookTitle', book.title);
        setInputValue('bookAuthor', book.author);
        setInputValue('bookISBN', book.isbn);
        const categorySelect = this.getElement('bookCategory');
        if (categorySelect)
            categorySelect.value = book.category;
        const form = this.getElement('bookForm');
        if (form) {
            form.dataset.editId = id;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn)
                submitBtn.textContent = 'Update Book';
        }
        const accordion = document.querySelector('#books .accordion-trigger');
        if (accordion && !accordion.classList.contains('active')) {
            this.toggleAccordion(accordion);
        }
    }
    editMember(id) {
        const member = this.getMember(id);
        if (!member)
            return;
        const setInputValue = (inputId, value) => {
            const input = this.getElement(inputId);
            if (input)
                input.value = value;
        };
        setInputValue('memberName', member.name);
        setInputValue('memberEmail', member.email);
        setInputValue('memberPhone', member.phone);
        const typeSelect = this.getElement('memberType');
        if (typeSelect)
            typeSelect.value = member.type;
        const form = this.getElement('memberForm');
        if (form) {
            form.dataset.editId = id;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn)
                submitBtn.textContent = 'Update Member';
        }
        const accordion = document.querySelector('#members .accordion-trigger');
        if (accordion && !accordion.classList.contains('active')) {
            this.toggleAccordion(accordion);
        }
    }
    confirmDeleteBook(id) {
        const book = this.getBook(id);
        if (!book)
            return;
        if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
            if (this.deleteBook(id)) {
                this.renderBooks();
                this.updateStats();
                this.updateDropdowns();
            }
        }
    }
    confirmDeleteMember(id) {
        const member = this.getMember(id);
        if (!member)
            return;
        if (confirm(`Are you sure you want to delete member "${member.name}"?`)) {
            if (this.deleteMember(id)) {
                this.renderMembers();
                this.updateStats();
                this.updateDropdowns();
            }
        }
    }
    clearBookForm() {
        const form = this.getElement('bookForm');
        if (!form)
            return;
        form.reset();
        delete form.dataset.editId;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn)
            submitBtn.textContent = 'Add Book';
    }
    clearMemberForm() {
        const form = this.getElement('memberForm');
        if (!form)
            return;
        form.reset();
        delete form.dataset.editId;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn)
            submitBtn.textContent = 'Add Member';
    }
    renderAll() {
        this.renderBooks();
        this.renderMembers();
        this.renderTransactions();
        this.renderRecentActivities();
    }
    toggleAccordion(trigger) {
        const content = trigger.nextElementSibling;
        const isActive = content.classList.contains('active');
        document.querySelectorAll('.accordion-content').forEach(acc => {
            acc.classList.remove('active');
        });
        document.querySelectorAll('.accordion-trigger').forEach(trig => {
            trig.classList.remove('active');
        });
        if (!isActive) {
            content.classList.add('active');
            trigger.classList.add('active');
        }
    }
    getLibraryStats() {
        const overdueBooks = this.getOverdueTransactions().length;
        return {
            totalBooks: this.books.length,
            availableBooks: this.getAvailableBooks().length,
            borrowedBooks: this.books.filter(book => book.status === 'borrowed').length,
            overdueBooks,
            totalMembers: this.members.length,
            activeTransactions: this.getActiveTransactions().length
        };
    }
    getMostBorrowedBooks(limit = 5) {
        const borrowCounts = new Map();
        this.transactions.forEach(transaction => {
            if (transaction.type === 'borrow') {
                const count = borrowCounts.get(transaction.bookId) || 0;
                borrowCounts.set(transaction.bookId, count + 1);
            }
        });
        const results = [];
        borrowCounts.forEach((count, bookId) => {
            const book = this.getBook(bookId);
            if (book) {
                results.push({ book, borrowCount: count });
            }
        });
        return results
            .sort((a, b) => b.borrowCount - a.borrowCount)
            .slice(0, limit);
    }
    getMostActiveMembers(limit = 5) {
        const borrowCounts = new Map();
        this.transactions.forEach(transaction => {
            if (transaction.type === 'borrow') {
                const count = borrowCounts.get(transaction.memberId) || 0;
                borrowCounts.set(transaction.memberId, count + 1);
            }
        });
        const results = [];
        borrowCounts.forEach((count, memberId) => {
            const member = this.getMember(memberId);
            if (member) {
                results.push({ member, borrowCount: count });
            }
        });
        return results
            .sort((a, b) => b.borrowCount - a.borrowCount)
            .slice(0, limit);
    }
    searchBooks(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.books.filter(book => book.title.toLowerCase().includes(lowercaseQuery) ||
            book.author.toLowerCase().includes(lowercaseQuery) ||
            book.isbn.toLowerCase().includes(lowercaseQuery) ||
            book.category.toLowerCase().includes(lowercaseQuery));
    }
    searchMembers(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.members.filter(member => member.name.toLowerCase().includes(lowercaseQuery) ||
            member.email.toLowerCase().includes(lowercaseQuery) ||
            member.phone.toLowerCase().includes(lowercaseQuery));
    }
    filterBooksByCategory(category) {
        return this.books.filter(book => book.category === category);
    }
    filterBooksByStatus(status) {
        return this.books.filter(book => book.status === status);
    }
    filterMembersByType(type) {
        return this.members.filter(member => member.type === type);
    }
    exportData() {
        return {
            books: this.books,
            members: this.members,
            transactions: this.transactions,
            exportDate: new Date().toISOString()
        };
    }
    importData(data) {
        try {
            if (data.books)
                this.books = data.books;
            if (data.members)
                this.members = data.members;
            if (data.transactions)
                this.transactions = data.transactions;
            this.renderAll();
            this.updateStats();
            this.updateDropdowns();
            return true;
        }
        catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}
LibrarySystem.BORROW_LIMITS = {
    'Regular': 3,
    'Student': 5,
    'Faculty': 10,
    'Senior': 2
};
LibrarySystem.BORROW_PERIODS = {
    'Regular': 14,
    'Student': 21,
    'Faculty': 30,
    'Senior': 14
};
let library;
export function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-links a[onclick*="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}
export function toggleAccordion(trigger) {
    if (library) {
        library.toggleAccordion(trigger);
    }
}
export function clearBookForm() {
    if (library) {
        library.clearBookForm();
    }
}
export function clearMemberForm() {
    if (library) {
        library.clearMemberForm();
    }
}
export function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
export function formatDueDate(dueDate) {
    if (!dueDate)
        return '-';
    const now = new Date();
    const isOverdue = now > dueDate;
    const formatted = formatDate(dueDate);
    return isOverdue ? `${formatted} (Overdue)` : formatted;
}
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Library Management System initializing...');
    try {
        library = new LibrarySystem();
        window.library = library;
        window.showSection = showSection;
        window.toggleAccordion = toggleAccordion;
        window.clearBookForm = clearBookForm;
        window.clearMemberForm = clearMemberForm;
        library.renderAll();
        library.updateStats();
        library.updateDropdowns();
        console.log('✅ Library Management System initialized successfully');
        console.log('📊 Initial stats:', library.getLibraryStats());
        const activities = window.recentActivities || [];
        if (activities.length === 0) {
            window.recentActivities = [
                {
                    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    type: 'Book Borrowed',
                    description: 'Emma Watson - "Dune"',
                    status: 'borrowed'
                },
                {
                    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
                    type: 'Book Borrowed',
                    description: 'Ryan Gosling - "The Hunger Games"',
                    status: 'borrowed'
                },
                {
                    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    type: 'Book Returned',
                    description: 'Zendaya Coleman - "The Twilight Saga: Twilight"',
                    status: 'returned'
                },
                {
                    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    type: 'New Member',
                    description: 'Tom Holland',
                    status: 'registered'
                }
            ];
            library.renderRecentActivities();
        }
    }
    catch (error) {
        console.error('❌ Failed to initialize Library Management System:', error);
    }
});
