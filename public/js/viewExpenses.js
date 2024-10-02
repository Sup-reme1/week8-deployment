document.addEventListener('DOMContentLoaded', () => {
    // This script fetches the session data when the page loads
    window.onload = function() {
        fetch('http://localhost:8001/api/session')
            .then(response => response.json())
            .then(data => {
                if (!data.loggedIn) {
                    window.location.href = '/login'; // Redirect to login if not logged in
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const fetchExpenses = async () =>{
        try{
            const response = await fetch('http://localhost:8001/api/view_expense', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            })
            if (!response.ok){
                throw new Error('fail to fetch expenses');
            }
            const expenses = await response.json();
            displayExpenses(expenses);
            
    
        } catch(error){
            console.error('error:', error);
        }
    };

    const deleteExpense = async (expense_id) => {
        const response = await fetch('http://localhost:8001/api/delete_expense', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expense_id })
        });

        if (response.ok) {
            console.log('Expense deleted successfully');
        } else {
            console.error('Failed to delete expense:', response.statusText);
        }
    }
    

    // function to display expenses in the UI
    const displayExpenses = (expenses) => {
        const expenseTableBody = document.querySelector('.expense-table tbody');
        expenseTableBody.innerHTML = ''; // Clear any existing rows
    
        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', expense.expense_id);

            var date = new Date(expense.date)

            const formattedDate = date.toISOString().split('T')[0];

            // Add tabble cells for each expense property
            row.innerHTML = `
                            <td>${expense.category}</td>
                            <td>${expense.amount}</td>
                            <td>${formattedDate}</td>
                            <td><button class="edit-btn" data-id='${expense.expense_id}'>Edit</button></td>
                            <td><button class="delete-btn" data-id='${expense.expense_id}'>Delete</button></td>
                            `;
    
            // Append the row to the table body
            expenseTableBody.appendChild(row);

            // // Attach event listeners to edit buttons
            // const editBtn = expenseTableBody.querySelectorAll('button.edit-btn');
            // // console.log(editBtn);
            // editBtn.forEach(button => {
            //     button.addEventListener('click', () => {
            //         const id = button.getAttribute('data-id');
            //         document.querySelector('.add-expenses').style.display = 'none';
            //         editExpense(id);    // function call to edit expense
            //     });
            // });

            // // // Add an event listener to delete buttons
            // const deleteBtn = expenseTableBody.querySelectorAll('button.delete-btn');
            // deleteBtn.forEach(button => {
            //     button.addEventListener('click', ()=>{
            //         const id = button.getAttribute('data-id');
            //         console.log(id);

            //         deleteExpense(id);
            //         document.location.reload();
            //     })
            // })

            ////// Using Event DELEGATION
            expenseTableBody.addEventListener('click', (event) => {
                // Check if delete btn is clicked
                console.log('table is clicked');
                if (event.target.classList.contains('delete-btn')){
                    const id = event.target.getAttribute('data-id');

                    // Remove the Expenses
                    deleteExpense(id);
                    document.location.reload();
                }

                if (event.target.classList.contains('edit-btn')){
                    const id = event.target.getAttribute('data-id');

                    // Prefill the expense in the edit form
                    document.querySelector('.add-expenses').style.display = 'none';
                    editExpense(id);    
                }
            })
        });
    };
    
    fetchExpenses(); // function to fetch expenses and display in table

    // attarch event listener to edit-expense Submit button
    const submitBtn = document.querySelector('.edit-expenses form');
    submitBtn.addEventListener('submit',() =>{
        fetchExpenses();
        document.querySelector('.edit-expenses').style.display = 'none';
    })

    function editExpense(id){
        const row = document.querySelector(`tr[data-id='${id}']`);
        const category = row.querySelector('td:nth-child(1)').textContent;
        const amount = row.querySelector('td:nth-child(2)').textContent;
        const date = row.querySelector('td:nth-child(3)').textContent;

        // populate the form fields with row data
        document.querySelector('.edit-expenses #expense_id').value = id;
        document.querySelector('.edit-expenses #category').value = category;
        document.querySelector('.edit-expenses #date').value = date;
        document.querySelector('.edit-expenses #amount').value = amount;

        // Show Edit form
        document.querySelector('.edit-expenses').style.display = 'block';
    }
});
