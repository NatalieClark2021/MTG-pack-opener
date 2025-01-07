<script>
    // Declare variables for two-way binding
    let userInput = "";

    // Function to handle the form submission
    function handleSubmit() {
        alert(`Submitted: ${userInput}`);
        // Clear the input field (optional)
        userInput = "";
    }
</script>

<style>
    /* Add styles if needed */
    .form-container {
        margin: 1rem 0;
    }
    input {
        margin-right: 0.5rem;
        padding: 0.5rem;
    }
    button {
        padding: 0.5rem 1rem;
        cursor: pointer;
    }
</style>

<div class="form-container">
    <input
            type="text"
            placeholder="Enter something..."
            bind:value={userInput}
    />
    <button on:click={handleSubmit}>Submit</button>
</div>