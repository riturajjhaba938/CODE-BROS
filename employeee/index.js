        // Application State
        let expenses = JSON.parse(localStorage.getItem('employeeExpenses')) || [
            { id: 1, employee: "Michael Chen", date: "2023-06-15", category: "Travel", description: "Flight to client meeting", amount: 450.00, currency: "USD", status: "pending", approver: "Sarah Johnson", receipt: "flight.jpg" },
            { id: 2, employee: "Michael Chen", date: "2023-06-10", category: "Meals", description: "Team lunch", amount: 120.50, currency: "USD", status: "approved", approver: "Sarah Johnson", receipt: "lunch.jpg" },
            { id: 3, employee: "Michael Chen", date: "2023-06-05", category: "Equipment", description: "New monitor", amount: 320.00, currency: "USD", status: "rejected", approver: "Sarah Johnson", receipt: "monitor.jpg" }
        ];

        // Initialize the application
        function initApp() {
            renderExpensesTables();
            updateDashboardData();
        }

        // Render expenses tables
        function renderExpensesTables() {
            // Dashboard table
            const dashboardTableBody = document.getElementById('dashboardTableBody');
            dashboardTableBody.innerHTML = '';
            
            const recentExpenses = expenses.filter(e => e.employee === 'Michael Chen').slice(0, 5);
            
            recentExpenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td><span class="status status-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span></td>
                    <td class="action-buttons">
                        <button class="action-btn btn-outline" onclick="viewExpense(${expense.id})">View</button>
                        ${expense.status === 'pending' ? `<button class="action-btn btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>` : ''}
                    </td>
                `;
                dashboardTableBody.appendChild(row);
            });

            // My Expenses table
            const expensesTableBody = document.getElementById('expensesTableBody');
            expensesTableBody.innerHTML = '';
            
            const userExpenses = expenses.filter(e => e.employee === 'Michael Chen');
            userExpenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td><span class="status status-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span></td>
                    <td>${expense.approver}</td>
                    <td class="action-buttons">
                        <button class="action-btn btn-outline" onclick="viewExpense(${expense.id})">View</button>
                        ${expense.status === 'pending' ? `<button class="action-btn btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>` : ''}
                    </td>
                `;
                expensesTableBody.appendChild(row);
            });
        }

        // Update dashboard data
        function updateDashboardData() {
            const userPending = expenses.filter(e => e.employee === 'Michael Chen' && e.status === 'pending').length;
            document.getElementById('pendingCount').textContent = userPending;
        }

        // View expense details
        function viewExpense(id) {
            const expense = expenses.find(e => e.id === id);
            if (expense) {
                document.getElementById('modalDate').textContent = expense.date;
                document.getElementById('modalCategory').textContent = expense.category;
                document.getElementById('modalDescription').textContent = expense.description;
                document.getElementById('modalAmount').textContent = `$${expense.amount.toFixed(2)}`;
                document.getElementById('modalStatus').innerHTML = `<span class="status status-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span>`;
                document.getElementById('modalApprover').textContent = expense.approver;
                
                document.getElementById('expenseModal').style.display = 'flex';
            }
        }

        // Submit new expense
        function submitExpense() {
            const date = document.getElementById('expenseDate').value;
            const category = document.getElementById('expenseCategory').value;
            const description = document.getElementById('expenseDescription').value;
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const currency = document.getElementById('expenseCurrency').value;
            
            if (!date || !category || !description || !amount) {
                alert('Please fill in all required fields.');
                return false;
            }
            
            const newExpense = {
                id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
                employee: "Michael Chen",
                date: date,
                category: category,
                description: description,
                amount: amount,
                currency: currency,
                status: "pending",
                approver: "Sarah Johnson",
                receipt: "receipt.jpg"
            };
            
            expenses.push(newExpense);
            localStorage.setItem('employeeExpenses', JSON.stringify(expenses));
            renderExpensesTables();
            updateDashboardData();
            
            // Send to admin (simulate API call)
            sendExpenseToAdmin(newExpense);
            
            return true;
        }

        // Send expense to admin (simulation)
        function sendExpenseToAdmin(expense) {
            // In a real application, this would be an API call to the backend
            const adminExpenses = JSON.parse(localStorage.getItem('adminExpenses')) || [];
            adminExpenses.push(expense);
            localStorage.setItem('adminExpenses', JSON.stringify(adminExpenses));
            console.log('Expense sent to admin for approval:', expense);
        }

        // Delete expense
        function deleteExpense(id) {
            if (confirm('Are you sure you want to delete this expense?')) {
                expenses = expenses.filter(e => e.id !== id);
                localStorage.setItem('employeeExpenses', JSON.stringify(expenses));
                renderExpensesTables();
                updateDashboardData();
            }
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            initApp();
            
            // Tab Navigation
            document.querySelectorAll('nav a').forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all tabs and contents
                    document.querySelectorAll('nav a').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
            
            // Set today's date as default for expense date
            document.getElementById('expenseDate').valueAsDate = new Date();
            
            // Add Expense Button
            document.getElementById('addExpenseBtn').addEventListener('click', () => {
                // Switch to submit expense tab
                document.querySelectorAll('nav a').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                document.querySelector('nav a[data-tab="submit-expense"]').classList.add('active');
                document.getElementById('submit-expense').classList.add('active');
            });
            
            // OCR Receipt Scanning
            document.getElementById('scanReceiptBtn').addEventListener('click', function() {
                const fileInput = document.getElementById('expenseReceipt');
                const ocrProcessing = document.getElementById('ocrProcessing');
                const receiptPreview = document.getElementById('receiptPreview');
                
                if (!fileInput.files.length) {
                    alert('Please select a receipt image first.');
                    return;
                }
                
                // Show OCR processing
                ocrProcessing.style.display = 'block';
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
                
                // Simulate OCR processing delay
                setTimeout(() => {
                    // Hide processing and show results
                    ocrProcessing.style.display = 'none';
                    receiptPreview.style.display = 'block';
                    
                    // Reset button
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-camera"></i> Scan Receipt with OCR';
                    
                    // Simulate extracted data
                    const simulatedData = {
                        merchant: "The Grand Restaurant",
                        date: "2023-06-15",
                        amount: "85.50",
                        category: "meals"
                    };
                    
                    // Fill form with extracted data
                    document.getElementById('expenseDate').value = simulatedData.date;
                    document.getElementById('expenseCategory').value = simulatedData.category;
                    document.getElementById('expenseDescription').value = `Business lunch at ${simulatedData.merchant}`;
                    document.getElementById('expenseAmount').value = simulatedData.amount;
                    
                    // Update receipt preview
                    document.getElementById('receiptMerchant').textContent = simulatedData.merchant;
                    document.getElementById('receiptDate').textContent = simulatedData.date;
                    document.getElementById('receiptAmount').textContent = `$${simulatedData.amount}`;
                    document.getElementById('receiptCategory').textContent = simulatedData.category.charAt(0).toUpperCase() + simulatedData.category.slice(1);
                    
                    // Show preview image
                    const file = fileInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('receiptImage').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                    
                    // Show success message
                    alert('Receipt successfully scanned! Form has been auto-filled with extracted data.');
                }, 3000);
            });
            
            // Submit Expense
            document.getElementById('submitExpenseBtn').addEventListener('click', function() {
                // Show loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                this.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    if (submitExpense()) {
                        // Show success message
                        alert('Expense submitted successfully! It is now pending approval.');
                        
                        // Reset form
                        document.getElementById('expenseDate').valueAsDate = new Date();
                        document.getElementById('expenseCategory').value = '';
                        document.getElementById('expenseDescription').value = '';
                        document.getElementById('expenseAmount').value = '';
                        document.getElementById('expenseReceipt').value = '';
                        document.getElementById('receiptPreview').style.display = 'none';
                        
                        // Switch to My Expenses tab
                        document.querySelectorAll('nav a').forEach(t => t.classList.remove('active'));
                        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                        
                        document.querySelector('nav a[data-tab="expenses"]').classList.add('active');
                        document.getElementById('expenses').classList.add('active');
                    }
                    
                    // Reset button
                    this.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Expense';
                    this.disabled = false;
                }, 1500);
            });
            
            // Modal Handling
            const expenseModal = document.getElementById('expenseModal');
            const closeButtons = document.querySelectorAll('.close, .close-modal');
            
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    expenseModal.style.display = 'none';
                });
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === expenseModal) {
                    expenseModal.style.display = 'none';
                }
            });
            
            // Logout
            document.getElementById('logoutBtn').addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    // In a real app, this would redirect to login page
                    alert('You have been logged out.');
                }
            });
        });