// KLARTI+ Configuration
// This file contains your Supabase configuration for the website

const CONFIG = {
    SUPABASE: {
        URL: 'https://wirtaatvxdipwaqpfqrc.supabase.co',
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcnRhYXR2eGRpcHdhcXBmcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MjExMTksImV4cCI6MjA3NTA5NzExOX0.39ziY0X5K1sYz6G5K1SYx0xKP3ZIPn1MseI2Ki3VaLc'
    },
    EMAIL: {
        NOTIFICATION_EMAIL: 'prasanna.sidhan2003@gmail.com'
    },
    DATABASE: {
        TABLE_NAME: 'demo_requests'
    }
};

// Make config available globally
window.KLARTI_CONFIG = CONFIG;