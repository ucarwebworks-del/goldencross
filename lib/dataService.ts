// Data service for fetching/saving data via API (works with Redis)

const API_URL = '/api/data';

export async function fetchData<T>(key: string, fallback: T): Promise<T> {
    try {
        const response = await fetch(`${API_URL}?key=${encodeURIComponent(key)}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        return result.data ?? fallback;
    } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        // Fallback to localStorage for offline/development
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : fallback;
        }
        return fallback;
    }
}

export async function saveData<T>(key: string, data: T): Promise<boolean> {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, data })
        });

        if (!response.ok) throw new Error('Failed to save');

        // Also save to localStorage as backup
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data));
        }

        return true;
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data));
        }
        return false;
    }
}
