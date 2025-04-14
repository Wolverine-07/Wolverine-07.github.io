// Text Analysis Functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the text-analysis page
    const isTextAnalysisPage = document.title === "Text Analysis" || 
                              window.location.href.includes('text-analysis.html');
    
    // Only initialize text analysis functionality if on the correct page
    if (!isTextAnalysisPage) return;

    // Get UI elements
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsContainer = document.getElementById('analysis-results');
    
    if(!textInput || !analyzeBtn || !resultsContainer) return; // Safety check
    
    // Add event listener for the analyze button
    analyzeBtn.addEventListener('click', analyzeText);
    
    // Add event listener for the reset button
    if(resetBtn) {
        resetBtn.addEventListener('click', resetAnalysis);
    }
    
    // Add event listener to track actual Enter key presses
    textInput.addEventListener('input', function() {
        // This will update the analysis automatically as user types
        if (resultsContainer.style.display === 'block') {
            analyzeText();
        }
    });
    
    // Add a specific keydown listener to accurately track Enter key presses
    textInput.addEventListener('keydown', function(event) {
        // Only process Enter key presses
        if (event.key === 'Enter') {
            // We don't need to do anything special here since the newline character
            // will be added to the text and captured by the input event
            console.log('Enter key pressed - newline added');
            
            // Force an immediate analysis update when Enter is pressed
            if (resultsContainer.style.display === 'block') {
                setTimeout(analyzeText, 0); // Use timeout to ensure text is updated first
            }
        }
    });
    
    // Function to reset the analysis
    function resetAnalysis() {
        // Clear the text input
        textInput.value = '';
        
        // Hide the results container
        resultsContainer.style.display = 'none';
        
        // Clear all results
        document.getElementById('basic-stats').innerHTML = '';
        document.getElementById('pronoun-stats').innerHTML = '';
        document.getElementById('preposition-stats').innerHTML = '';
        document.getElementById('article-stats').innerHTML = '';
        
        // Focus on the text input for new entry
        textInput.focus();
    }
    
    // Text analysis function
    function analyzeText() {
        const text = textInput.value;
        
        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }
        
        // Show the results section
        resultsContainer.style.display = 'block';
        
        // Calculate basic statistics
        const basicStats = calculateBasicStats(text);
        displayBasicStats(basicStats);
        
        // Count pronouns
        const pronouns = countPronouns(text);
        displayPronounStats(pronouns);
        
        // Count prepositions
        const prepositions = countPrepositions(text);
        displayPrepositionStats(prepositions);
        
        // Count indefinite articles
        const articles = countIndefiniteArticles(text);
        displayArticleStats(articles);
    }
});

// Function to calculate basic text statistics
function calculateBasicStats(text) {
    // Count letters properly
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    
    // Count words properly
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    
    // Count spaces correctly - all whitespace characters except newlines
    const spaces = (text.match(/[^\S\n]/g) || []).length;
    
    // Count lines properly - only count actual newlines entered by user
    const newlineCount = (text.match(/\n/g) || []).length;
    // If there's text and at least one newline, we have newlineCount+1 lines
    // If there's text but no newlines, we have 1 line
    // If there's no text, we have 0 lines
    const lines = text.trim() ? (newlineCount) : 0;
    
    // Count special symbols properly
    const specialSymbols = (text.match(/[^\w\s]/g) || []).length;
    
    console.log(`Text analysis - Newlines found: ${newlineCount}, Total lines: ${lines}`);
    
    return {
        letters: letters,
        words: words,
        spaces: spaces,
        lines: lines,
        specialSymbols: specialSymbols
    };
}

// Function to display basic statistics
function displayBasicStats(stats) {
    const statsContainer = document.getElementById('basic-stats');
    statsContainer.innerHTML = '';
    
    for (const [key, value] of Object.entries(stats)) {
        const statItem = document.createElement('div');
        statItem.className = 'interest-item';
        statItem.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
        statsContainer.appendChild(statItem);
    }
}

// Function to count pronouns
function countPronouns(text) {
    const pronounList = [
        'i', 'me', 'my', 'mine', 'myself',
        'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself',
        'she', 'her', 'hers', 'herself',
        'it', 'its', 'itself',
        'we', 'us', 'our', 'ours', 'ourselves',
        'they', 'them', 'their', 'theirs', 'themselves',
        'this', 'that', 'these', 'those',
        'who', 'whom', 'whose', 'which', 'what'
    ];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const pronounCounts = {};
    
    pronounList.forEach(pronoun => {
        pronounCounts[pronoun] = 0;
    });
    
    words.forEach(word => {
        if (pronounList.includes(word)) {
            pronounCounts[word]++;
        }
    });
    
    // Filter out pronouns with zero count
    return Object.fromEntries(
        Object.entries(pronounCounts).filter(([_, count]) => count > 0)
    );
}

// Function to display pronoun statistics
function displayPronounStats(pronouns) {
    const pronounContainer = document.getElementById('pronoun-stats');
    
    if (Object.keys(pronouns).length === 0) {
        pronounContainer.innerHTML = '<p>No pronouns found in the text.</p>';
        return;
    }
    
    // Sort pronouns by count (descending)
    const sortedPronouns = Object.entries(pronouns)
        .sort((a, b) => b[1] - a[1]);
    
    // Create a table for pronouns
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '15px';
    
    // Add header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid var(--text-secondary);">Pronoun</th>
        <th style="text-align: right; padding: 8px; border-bottom: 1px solid var(--text-secondary);">Count</th>
    `;
    table.appendChild(headerRow);
    
    // Add data rows
    sortedPronouns.forEach(([pronoun, count]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: left; padding: 8px; border-bottom: 1px solid var(--border-color);">${pronoun}</td>
            <td style="text-align: right; padding: 8px; border-bottom: 1px solid var(--border-color);">${count}</td>
        `;
        table.appendChild(row);
    });
    
    pronounContainer.innerHTML = '';
    pronounContainer.appendChild(table);
}

// Function to count prepositions
function countPrepositions(text) {
    const prepositionList = [
        'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
        'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
        'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 'during',
        'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of',
        'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
        'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards',
        'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
    ];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const prepositionCounts = {};
    
    prepositionList.forEach(preposition => {
        prepositionCounts[preposition] = 0;
    });
    
    words.forEach(word => {
        if (prepositionList.includes(word)) {
            prepositionCounts[word]++;
        }
    });
    
    // Filter out prepositions with zero count
    return Object.fromEntries(
        Object.entries(prepositionCounts).filter(([_, count]) => count > 0)
    );
}

// Function to display preposition statistics
function displayPrepositionStats(prepositions) {
    const prepositionContainer = document.getElementById('preposition-stats');
    
    if (Object.keys(prepositions).length === 0) {
        prepositionContainer.innerHTML = '<p>No prepositions found in the text.</p>';
        return;
    }
    
    // Sort prepositions by count (descending)
    const sortedPrepositions = Object.entries(prepositions)
        .sort((a, b) => b[1] - a[1]);
    
    // Create a table for prepositions
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '15px';
    
    // Add header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid var(--text-secondary);">Preposition</th>
        <th style="text-align: right; padding: 8px; border-bottom: 1px solid var(--text-secondary);">Count</th>
    `;
    table.appendChild(headerRow);
    
    // Add data rows
    sortedPrepositions.forEach(([preposition, count]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: left; padding: 8px; border-bottom: 1px solid var(--border-color);">${preposition}</td>
            <td style="text-align: right; padding: 8px; border-bottom: 1px solid var(--border-color);">${count}</td>
        `;
        table.appendChild(row);
    });
    
    prepositionContainer.innerHTML = '';
    prepositionContainer.appendChild(table);
}

// Function to count indefinite articles
function countIndefiniteArticles(text) {
    const articleList = ['a', 'an'];
    
    // We need to be careful with "a" and "an" to ensure they're used as articles
    // This regex looks for "a" or "an" followed by a space and then a word
    const aMatches = text.toLowerCase().match(/\ba\s+[a-z]+/g) || [];
    const anMatches = text.toLowerCase().match(/\ban\s+[a-z]+/g) || [];
    
    return {
        'a': aMatches.length,
        'an': anMatches.length
    };
}

// Function to display article statistics
function displayArticleStats(articles) {
    const articleContainer = document.getElementById('article-stats');
    
    // Create a table for articles
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '15px';
    
    // Add header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid var(--text-secondary);">Article</th>
        <th style="text-align: right; padding: 8px; border-bottom: 1px solid var(--text-secondary);">Count</th>
    `;
    table.appendChild(headerRow);
    
    // Add data rows
    for (const [article, count] of Object.entries(articles)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: left; padding: 8px; border-bottom: 1px solid var(--border-color);">${article}</td>
            <td style="text-align: right; padding: 8px; border-bottom: 1px solid var(--border-color);">${count}</td>
        `;
        table.appendChild(row);
    }
    
    articleContainer.innerHTML = '';
    articleContainer.appendChild(table);
}

// Creates text analysis UI if not present
function createTextAnalysisUI() {
    // This function is only used as fallback and shouldn't be needed
    // if the HTML is properly set up
    console.warn("Using fallback text analysis UI creation");
}