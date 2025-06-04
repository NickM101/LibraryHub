export type BookStatus = 'available' | 'borrowed' | 'overdue';
export type MemberType = 'Regular' | 'Student' | 'Faculty' | 'Senior';
export type TransactionType = 'borrow' | 'return';
export type TransactionStatus = 'active' | 'completed' | 'overdue';
export type ActivityStatus = 'borrowed' | 'returned' | 'registered' | 'added' | 'deleted';

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    status: BookStatus;
    borrowedBy: string | null;
    borrowedDate: Date | null;
    dueDate: Date | null;
}

export interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: MemberType;
    borrowedBooks: string[];
    joinDate: Date;
}

export interface Transaction {
    id: string;
    memberId: string;
    bookId: string;
    type: TransactionType;
    date: Date;
    dueDate: Date | null;
    status: TransactionStatus;
}

export interface Activity {
    time: Date;
    type: string;
    description: string;
    status: ActivityStatus;
}

export type CreateBookInput = Omit<Book, 'id' | 'status' | 'borrowedBy' | 'borrowedDate' | 'dueDate'>;
export type CreateMemberInput = Omit<Member, 'id' | 'borrowedBooks' | 'joinDate'>;
export type UpdateBookInput = Partial<Omit<Book, 'id'>>;
export type UpdateMemberInput = Partial<Omit<Member, 'id' | 'joinDate'>>;

type BorrowLimits = {
    [key in MemberType]: number;
}

type BorrowPeriods = {
    [key in MemberType]: number;
}

 class LibrarySystem {
    private books: Book[] = [];
    private members: Member[] = [];
    private transactions: Transaction[] = [];
    private static readonly BORROW_LIMITS: BorrowLimits = {
        'Regular': 3,
        'Student': 5,
        'Faculty': 10,
        'Senior': 2
    };
    private static readonly BORROW_PERIODS: BorrowPeriods = {
        'Regular': 14,
        'Student': 21,
        'Faculty': 30,
        'Senior': 14
    };

    constructor() {
        this.initializeData();
        this.setupEventListeners();
        this.setupThemeToggle();
    }

    private initializeData(): void {
        this.books = this.getSampleBooks();
        this.members = this.getSampleMembers();
        this.transactions = this.getSampleTransactions();
    }

    private getSampleBooks(): Book[] {
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

    private getSampleMembers(): Member[] {
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

    private getSampleTransactions(): Transaction[] {
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

    private setupEventListeners(): void {
        const bookForm = document.getElementById('bookForm') as HTMLFormElement;
        const memberForm = document.getElementById('memberForm') as HTMLFormElement;
        const transactionForm = document.getElementById('transactionForm') as HTMLFormElement;

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

    private setupThemeToggle(): void {
        const themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
        const themeIcon = themeToggle?.querySelector('.theme-icon') as HTMLSpanElement;
        
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

    private setTheme(theme: string): void {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('.theme-icon') as HTMLSpanElement;
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    private generateId(prefix: string): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${prefix}${timestamp}${random}`.toUpperCase();
    }

    private getElement<T extends HTMLElement>(id: string): T | null {
        return document.getElementById(id) as T | null;
    }

    private getInputValue(id: string): string {
        const element = this.getElement<HTMLInputElement>(id);
        return element ? element.value.trim() : '';
    }

    private getSelectValue(id: string): string {
        const element = this.getElement<HTMLSelectElement>(id);
        return element ? element.value : '';
    }

    public addBook(bookData: CreateBookInput): Book {
        const book: Book = {
            id: this.generateId('B'),
            ...bookData,
            status: 'available',
            borrowedBy: null,
            borrowedDate: null,
            dueDate: null
        };
        
        this.books.push(book);
        this.addActivity('Book Added', `"${book.title}" by ${book.author}`, 'added');
        return book;
    }

    public getBook(id: string): Book | null {
        return this.books.find(book => book.id === id) || null;
    }

    public updateBook(id: string, updates: UpdateBookInput): Book | null {
        const bookIndex = this.books.findIndex(book => book.id === id);
        if (bookIndex === -1) return null;
        
        this.books[bookIndex] = { ...this.books[bookIndex], ...updates };
        return this.books[bookIndex];
    }

    public deleteBook(id: string): boolean {
        const book = this.getBook(id);
        if (!book) return false;
        
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

    public getAllBooks(): Book[] {
        return [...this.books];
    }

    public getAvailableBooks(): Book[] {
        return this.books.filter(book => book.status === 'available');
    }

    public addMember(memberData: CreateMemberInput): Member {
        const member: Member = {
            id: this.generateId('M'),
            ...memberData,
            borrowedBooks: [],
            joinDate: new Date()
        };
        
        this.members.push(member);
        this.addActivity('New Member', member.name, 'registered');
        return member;
    }

    public getMember(id: string): Member | null {
        return this.members.find(member => member.id === id) || null;
    }

    public updateMember(id: string, updates: UpdateMemberInput): Member | null {
        const memberIndex = this.members.findIndex(member => member.id === id);
        if (memberIndex === -1) return null;
        
        this.members[memberIndex] = { ...this.members[memberIndex], ...updates };
        return this.members[memberIndex];
    }

    public deleteMember(id: string): boolean {
        const member = this.getMember(id);
        if (!member) return false;
        
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

    public getAllMembers(): Member[] {
        return [...this.members];
    }

    public findMemberByEmail(email: string): Member | null {
        return this.members.find(member => member.email === email) || null;
    }

    public borrowBook(bookId: string, memberId: string): boolean {
        const book = this.getBook(bookId);
        const member = this.getMember(memberId);
        
        if (!book || !member) return false;
        
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
        
        const transaction: Transaction = {
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

    public returnBook(bookId: string, memberId: string): boolean {
        const book = this.getBook(bookId);
        const member = this.getMember(memberId);
        
        if (!book || !member) return false;
        
        if (book.status !== 'borrowed' || book.borrowedBy !== memberId) {
            alert('This book is not borrowed by this member.');
            return false;
        }
        
        book.status = 'available';
        book.borrowedBy = null;
        book.borrowedDate = null;
        book.dueDate = null;
        
        member.borrowedBooks = member.borrowedBooks.filter(id => id !== bookId);
        
        const activeTransaction = this.transactions.find(t => 
            t.bookId === bookId && t.memberId === memberId && t.status === 'active'
        );
        if (activeTransaction) {
            activeTransaction.status = 'completed';
        }
        
        const transaction: Transaction = {
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

    public getAllTransactions(): Transaction[] {
        return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    public getActiveTransactions(): Transaction[] {
        return this.transactions.filter(t => t.status === 'active');
    }

    public getOverdueTransactions(): Transaction[] {
        const now = new Date();
        return this.transactions.filter(t => 
            t.status === 'active' && t.dueDate && now > t.dueDate
        );
    }

    private getBorrowLimit(memberType: MemberType): number {
        return LibrarySystem.BORROW_LIMITS[memberType];
    }

    private getBorrowPeriod(memberType: MemberType): number {
        return LibrarySystem.BORROW_PERIODS[memberType];
    }

    private addActivity(type: string, description: string, status: ActivityStatus): void {
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

    private getRecentActivities(): Activity[] {
        if (!(window as any).recentActivities) {
            (window as any).recentActivities = [];
        }
        return (window as any).recentActivities;
    }

    private handleBookSubmit(event: Event): void {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
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
        } else {
            this.addBook({ title, author, isbn, category });
        }
        
        this.clearBookForm();
        this.renderBooks();
        this.updateStats();
        this.updateDropdowns();
        
        const accordion = document.querySelector('.accordion-trigger.active') as HTMLButtonElement;
        if (accordion) this.toggleAccordion(accordion);
    }

    private handleMemberSubmit(event: Event): void {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
        const editId = form.dataset.editId;
        
        const name = this.getInputValue('memberName');
        const email = this.getInputValue('memberEmail');
        const phone = this.getInputValue('memberPhone');
        const type = this.getSelectValue('memberType') as MemberType;
        
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
        } else {
            this.addMember({ name, email, phone, type });
        }
        
        this.clearMemberForm();
        this.renderMembers();
        this.updateStats();
        this.updateDropdowns();
        
        const accordion = document.querySelector('.accordion-trigger.active') as HTMLButtonElement;
        if (accordion) this.toggleAccordion(accordion);
    }

    private handleTransactionSubmit(event: Event): void {
        event.preventDefault();
        
        const memberId = this.getSelectValue('transactionMember');
        const bookId = this.getSelectValue('transactionBook');
        const type = this.getSelectValue('transactionType') as TransactionType;
        
        if (!memberId || !bookId || !type) {
            alert('All fields are required.');
            return;
        }
        
        let success = false;
        if (type === 'borrow') {
            success = this.borrowBook(bookId, memberId);
        } else if (type === 'return') {
            success = this.returnBook(bookId, memberId);
        }
        
        if (success) {
            const form = this.getElement<HTMLFormElement>('transactionForm');
            if (form) form.reset();
            
            this.renderAll();
            this.updateStats();
            this.updateDropdowns();
            
            const accordion = document.querySelector('.accordion-trigger.active') as HTMLButtonElement;
            if (accordion) this.toggleAccordion(accordion);
        }
    }

    public renderBooks(): void {
        const tbody = this.getElement<HTMLTableSectionElement>('booksTableBody');
        if (!tbody) return;
        
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

    public renderMembers(): void {
        const tbody = this.getElement<HTMLTableSectionElement>('membersTableBody');
        if (!tbody) return;
        
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

    public renderTransactions(): void {
        const tbody = this.getElement<HTMLTableSectionElement>('transactionsTableBody');
        if (!tbody) return;
        
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

    public renderRecentActivities(): void {
        const tbody = this.getElement<HTMLTableSectionElement>('recentActivitiesBody');
        if (!tbody) return;
        
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

    private getActivityStatusClass(status: ActivityStatus): string {
        const statusMap: Record<ActivityStatus, string> = {
            'borrowed': 'borrowed',
            'returned': 'available',
            'registered': 'available',
            'added': 'available',
            'deleted': 'borrowed'
        };
        return statusMap[status] || 'available';
    }

    private getTimeAgo(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }

    public updateStats(): void {
        const totalBooks = this.books.length;
        const availableBooks = this.getAvailableBooks().length;
        const totalMembers = this.members.length;
        const borrowedBooks = this.books.filter(book => book.status === 'borrowed').length;
        
        const setElementText = (id: string, text: string): void => {
            const element = this.getElement(id);
            if (element) element.textContent = text;
        };
        
        setElementText('totalBooks', totalBooks.toString());
        setElementText('availableBooks', availableBooks.toString());
        setElementText('totalMembers', totalMembers.toString());
        setElementText('borrowedBooks', borrowedBooks.toString());
    }

    public updateDropdowns(): void {
        const memberSelect = this.getElement<HTMLSelectElement>('transactionMember');
        if (memberSelect) {
            memberSelect.innerHTML = '<option value="">Choose Member</option>' +
                this.members.map(member => 
                    `<option value="${member.id}">${member.name}</option>`
                ).join('');
        }
        
        const bookSelect = this.getElement<HTMLSelectElement>('transactionBook');
        if (bookSelect) {
            bookSelect.innerHTML = '<option value="">Choose Book</option>' +
                this.books.map(book => 
                    `<option value="${book.id}">${book.title} (${book.status})</option>`
                ).join('');
        }
    }

    public editBook(id: string): void {
        const book = this.getBook(id);
        if (!book) return;
        
        const setInputValue = (inputId: string, value: string): void => {
            const input = this.getElement<HTMLInputElement>(inputId);
            if (input) input.value = value;
        };
        
        setInputValue('bookTitle', book.title);
        setInputValue('bookAuthor', book.author);
        setInputValue('bookISBN', book.isbn);
        
        const categorySelect = this.getElement<HTMLSelectElement>('bookCategory');
        if (categorySelect) categorySelect.value = book.category;
        
        const form = this.getElement<HTMLFormElement>('bookForm');
        if (form) {
            form.dataset.editId = id;
            
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) submitBtn.textContent = 'Update Book';
        }
        
        const accordion = document.querySelector('#books .accordion-trigger') as HTMLButtonElement;
        if (accordion && !accordion.classList.contains('active')) {
            this.toggleAccordion(accordion);
        }
    }

    public editMember(id: string): void {
        const member = this.getMember(id);
        if (!member) return;
        
        const setInputValue = (inputId: string, value: string): void => {
            const input = this.getElement<HTMLInputElement>(inputId);
            if (input) input.value = value;
        };
        
        setInputValue('memberName', member.name);
        setInputValue('memberEmail', member.email);
        setInputValue('memberPhone', member.phone);
        
        const typeSelect = this.getElement<HTMLSelectElement>('memberType');
        if (typeSelect) typeSelect.value = member.type;
        
        const form = this.getElement<HTMLFormElement>('memberForm');
        if (form) {
            form.dataset.editId = id;
            
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) submitBtn.textContent = 'Update Member';
        }
        
        const accordion = document.querySelector('#members .accordion-trigger') as HTMLButtonElement;
        if (accordion && !accordion.classList.contains('active')) {
            this.toggleAccordion(accordion);
        }
    }

    public confirmDeleteBook(id: string): void {
        const book = this.getBook(id);
        if (!book) return;
        
        if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
            if (this.deleteBook(id)) {
                this.renderBooks();
                this.updateStats();
                this.updateDropdowns();
            }
        }
    }

    public confirmDeleteMember(id: string): void {
        const member = this.getMember(id);
        if (!member) return;
        
        if (confirm(`Are you sure you want to delete member "${member.name}"?`)) {
            if (this.deleteMember(id)) {
                this.renderMembers();
                this.updateStats();
                this.updateDropdowns();
            }
        }
    }

    public clearBookForm(): void {
        const form = this.getElement<HTMLFormElement>('bookForm');
        if (!form) return;
        
        form.reset();
        delete form.dataset.editId;
        
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitBtn) submitBtn.textContent = 'Add Book';
    }

    public clearMemberForm(): void {
        const form = this.getElement<HTMLFormElement>('memberForm');
        if (!form) return;
        
        form.reset();
        delete form.dataset.editId;
        
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitBtn) submitBtn.textContent = 'Add Member';
    }

    public renderAll(): void {
        this.renderBooks();
        this.renderMembers();
        this.renderTransactions();
        this.renderRecentActivities();
    }

    public toggleAccordion(trigger: HTMLButtonElement): void {
        const content = trigger.nextElementSibling as HTMLDivElement;
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

    public getLibraryStats(): {
        totalBooks: number;
        availableBooks: number;
        borrowedBooks: number;
        overdueBooks: number;
        totalMembers: number;
        activeTransactions: number;
    } {
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

    public getMostBorrowedBooks(limit: number = 5): Array<{book: Book; borrowCount: number}> {
        const borrowCounts = new Map<string, number>();
        
        this.transactions.forEach(transaction => {
            if (transaction.type === 'borrow') {
                const count = borrowCounts.get(transaction.bookId) || 0;
                borrowCounts.set(transaction.bookId, count + 1);
            }
        });
        
        const results: Array<{book: Book; borrowCount: number}> = [];
        
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

    public getMostActiveMembers(limit: number = 5): Array<{member: Member; borrowCount: number}> {
        const borrowCounts = new Map<string, number>();
        
        this.transactions.forEach(transaction => {
            if (transaction.type === 'borrow') {
                const count = borrowCounts.get(transaction.memberId) || 0;
                borrowCounts.set(transaction.memberId, count + 1);
            }
        });
        
        const results: Array<{member: Member; borrowCount: number}> = [];
        
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

    public searchBooks(query: string): Book[] {
        const lowercaseQuery = query.toLowerCase();
        return this.books.filter(book =>
            book.title.toLowerCase().includes(lowercaseQuery) ||
            book.author.toLowerCase().includes(lowercaseQuery) ||
            book.isbn.toLowerCase().includes(lowercaseQuery) ||
            book.category.toLowerCase().includes(lowercaseQuery)
        );
    }

    public searchMembers(query: string): Member[] {
        const lowercaseQuery = query.toLowerCase();
        return this.members.filter(member =>
            member.name.toLowerCase().includes(lowercaseQuery) ||
            member.email.toLowerCase().includes(lowercaseQuery) ||
            member.phone.toLowerCase().includes(lowercaseQuery)
        );
    }

    public filterBooksByCategory(category: string): Book[] {
        return this.books.filter(book => book.category === category);
    }

    public filterBooksByStatus(status: BookStatus): Book[] {
        return this.books.filter(book => book.status === status);
    }

    public filterMembersByType(type: MemberType): Member[] {
        return this.members.filter(member => member.type === type);
    }

    public exportData(): {
        books: Book[];
        members: Member[];
        transactions: Transaction[];
        exportDate: string;
    } {
        return {
            books: this.books,
            members: this.members,
            transactions: this.transactions,
            exportDate: new Date().toISOString()
        };
    }

    public importData(data: {
        books?: Book[];
        members?: Member[];
        transactions?: Transaction[];
    }): boolean {
        try {
            if (data.books) this.books = data.books;
            if (data.members) this.members = data.members;
            if (data.transactions) this.transactions = data.transactions;
            
            this.renderAll();
            this.updateStats();
            this.updateDropdowns();
            
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}

declare global {
    interface Window {
        library: LibrarySystem;
        recentActivities: Activity[];
        showSection: (sectionId: string) => void;
        toggleAccordion: (trigger: HTMLButtonElement) => void;
        clearBookForm: () => void;
        clearMemberForm: () => void;
    }
}

let library: LibrarySystem;

export function showSection(sectionId: string): void {
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

export function toggleAccordion(trigger: HTMLButtonElement): void {
    if (library) {
        library.toggleAccordion(trigger);
    }
}

export function clearBookForm(): void {
    if (library) {
        library.clearBookForm();
    }
}

export function clearMemberForm(): void {
    if (library) {
        library.clearMemberForm();
    }
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatDueDate(dueDate: Date | null): string {
    if (!dueDate) return '-';
    
    const now = new Date();
    const isOverdue = now > dueDate;
    const formatted = formatDate(dueDate);
    
    return isOverdue ? `${formatted} (Overdue)` : formatted;
}

document.addEventListener('DOMContentLoaded', function(): void {
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
        
        const activities = (window as any).recentActivities || [];
        if (activities.length === 0) {
            (window as any).recentActivities = [
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
        
    } catch (error) {
        console.error('❌ Failed to initialize Library Management System:', error);
    }
});