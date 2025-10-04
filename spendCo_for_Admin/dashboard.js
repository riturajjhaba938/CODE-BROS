        // Application State
        let expenses = JSON.parse(localStorage.getItem('adminExpenses')) || [
            { id: 1, employee: "Michael Chen", date: "2023-06-15", category: "Travel", description: "Flight to client meeting", amount: 450.00, currency: "USD", status: "pending", approver: "Sarah Johnson", receipt: "flight.jpg" },
            { id: 2, employee: "Michael Chen", date: "2023-06-10", category: "Meals", description: "Team lunch", amount: 120.50, currency: "USD", status: "approved", approver: "Sarah Johnson", receipt: "lunch.jpg" },
            { id: 3, employee: "Michael Chen", date: "2023-06-05", category: "Equipment", description: "New monitor", amount: 320.00, currency: "USD", status: "rejected", approver: "Sarah Johnson", receipt: "monitor.jpg" },
            { id: 4, employee: "Sarah Johnson", date: "2023-06-12", category: "Software", description: "Project management tool", amount: 150.00, currency: "USD", status: "pending", approver: "John Doe", receipt: "software.jpg" },
            { id: 5, employee: "David Wilson", date: "2023-06-08", category: "Training", description: "Online course", amount: 89.99, currency: "USD", status: "pending", approver: "Sarah Johnson", receipt: "training.jpg" }
        ];

        // Initialize the application
        function initApp() {
            renderExpensesTables();
            updateDashboardData();
            
            // Check for new expenses from employees
            checkForNewExpenses();
        }

        // Render expenses tables
        function renderExpensesTables() {
            // Dashboard table
            const dashboardTableBody = document.getElementById('dashboardTableBody');
            dashboardTableBody.innerHTML = '';
            
            const recentExpenses = expenses.slice(0, 5);
            
            recentExpenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.employee}</td>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td><span class="status status-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span></td>
                    <td class="action-buttons">
                        <button class="action-btn btn-outline" onclick="viewExpense(${expense.id})">View</button>
                        ${expense.status === 'pending' ? `
                            <button class="action-btn btn-success" onclick="approveExpense(${expense.id})">Approve</button>
                            <button class="action-btn btn-danger" onclick="rejectExpense(${expense.id})">Reject</button>
                        ` : ''}
                    </td>
                `;
                dashboardTableBody.appendChild(row);
            });

            // Approvals table
            const approvalsTableBody = document.getElementById('approvalsTableBody');
            approvalsTableBody.innerHTML = '';
            
            const pendingExpenses = expenses.filter(e => e.status === 'pending');
            pendingExpenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.employee}</td>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>${expense.approver}</td>
                    <td class="action-buttons">
                        <button class="action-btn btn-outline" onclick="viewExpense(${expense.id})">View Details</button>
                        <button class="action-btn btn-success" onclick="approveExpense(${expense.id})">Approve</button>
                        <button class="action-btn btn-danger" onclick="rejectExpense(${expense.id})">Reject</button>
                    </td>
                `;
                approvalsTableBody.appendChild(row);
            });

            // All Expenses table
            const allExpensesTableBody = document.getElementById('allExpensesTableBody');
            allExpensesTableBody.innerHTML = '';
            
            expenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.employee}</td>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td><span class="status status-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span></td>
                    <td>${expense.approver}</td>
                    <td class="action-buttons">
                        <button class="action-btn btn-outline" onclick="viewExpense(${expense.id})">View</button>
                    </td>
                `;
                allExpensesTableBody.appendChild(row);
            });
        }

        // Update dashboard data
        function updateDashboardData() {
            const pending = expenses.filter(e => e.status === 'pending').length;
            document.getElementById('adminPendingCount').textContent = pending;
        }

        // View expense details
        function viewExpense(id) {
            const expense = expenses.find(e => e.id === id);
            if (expense) {
                document.getElementById('modalEmployee').textContent = expense.employee;
                document.getElementById('modalDate').textContent = expense.date;
                document.getElementById('modalCategory').textContent = expense.category;
                document.getElementById('modalDescription').textContent = expense.description;
                document.getElementById('modalAmount').textContent = `$${expense.amount.toFixed(2)}`;
                document.getElementById('modalStatus').innerHTML = `<span class="status status-${expense.status}">${expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span>`;
                document.getElementById('modalApprover').textContent = expense.approver;
                
                // Show appropriate buttons based on status
                const modalFooter = document.getElementById('modalFooter');
                if (expense.status === 'pending') {
                    modalFooter.innerHTML = `
                        <button class="btn btn-success" onclick="approveExpense(${expense.id})">Approve</button>
                        <button class="btn btn-danger" onclick="rejectExpense(${expense.id})">Reject</button>
                        <button class="btn btn-outline close-modal">Close</button>
                    `;
                } else {
                    modalFooter.innerHTML = `<button class="btn btn-outline close-modal">Close</button>`;
                }
                
                document.getElementById('expenseModal').style.display = 'flex';
            }
        }

        // Approve expense
        function approveExpense(id) {
            const expense = expenses.find(e => e.id === id);
            if (expense) {
                expense.status = 'approved';
                localStorage.setItem('adminExpenses', JSON.stringify(expenses));
                renderExpensesTables();
                updateDashboardData();
                document.getElementById('expenseModal').style.display = 'none';
                alert('Expense approved successfully!');
            }
        }

        // Reject expense
        function rejectExpense(id) {
            const expense = expenses.find(e => e.id === id);
            if (expense) {
                expense.status = 'rejected';
                localStorage.setItem('adminExpenses', JSON.stringify(expenses));
                renderExpensesTables();
                updateDashboardData();
                document.getElementById('expenseModal').style.display = 'none';
                alert('Expense rejected.');
            }
        }

        // Check for new expenses from employees
        function checkForNewExpenses() {
            const employeeExpenses = JSON.parse(localStorage.getItem('employeeExpenses')) || [];
            
            // Find expenses that are not yet in admin expenses
            employeeExpenses.forEach(employeeExpense => {
                const exists = expenses.some(adminExpense => adminExpense.id === employeeExpense.id);
                if (!exists) {
                    expenses.push(employeeExpense);
                }
            });
            
            localStorage.setItem('adminExpenses', JSON.stringify(expenses));
            renderExpensesTables();
            updateDashboardData();
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
            
            // Settings Tab Navigation
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-settings-tab');
                    
                    // Remove active class from all settings tabs and contents
                    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    this.classList.add('active');
                    document.getElementById(tabId).classList.add('active');
                });
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
            
            // Check for new expenses every 5 seconds
            setInterval(checkForNewExpenses, 5000);
        });