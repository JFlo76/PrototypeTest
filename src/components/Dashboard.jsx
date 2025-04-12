import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Fab,
    TextField,
    Button,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    Dashboard as DashboardIcon,
    BarChart as AnalyticsIcon,
    Settings as SettingsIcon,
    Person as UserIcon,
    Notifications as NotificationsIcon,
    Help as HelpIcon,
    Chat as ChatIcon,
    Send as SendIcon,
    Close as CloseIcon,
    SmartToy as BotIcon,
} from '@mui/icons-material';
import {
    BarChart,
    LineChart,
} from '@mui/x-charts';

// Mock data for charts
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const userData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const revenueData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

function Dashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I can help you understand the data in these charts. Try asking something like "What was the highest revenue month?" or "How did user activity trend over time?"'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleGoBack = () => {
        window.location.href = '/';
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;

        // Add user message
        const newUserMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputMessage
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');

        // Process the message and generate a response
        setTimeout(() => {
            const botResponse = generateBotResponse(inputMessage);
            const newBotMessage = {
                id: messages.length + 2,
                sender: 'bot',
                text: botResponse
            };
            setMessages(prev => [...prev, newBotMessage]);
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Function to generate responses based on user questions
    const generateBotResponse = (question) => {
        const lowerQuestion = question.toLowerCase();

        // Revenue-related questions
        if (lowerQuestion.includes('highest revenue') || lowerQuestion.includes('best month') || lowerQuestion.includes('most revenue')) {
            const maxRevenue = Math.max(...revenueData);
            const maxRevenueIndex = revenueData.indexOf(maxRevenue);
            return `The highest revenue was $${maxRevenue} in ${months[maxRevenueIndex]}.`;
        }

        if (lowerQuestion.includes('lowest revenue') || lowerQuestion.includes('worst month')) {
            const minRevenue = Math.min(...revenueData);
            const minRevenueIndex = revenueData.indexOf(minRevenue);
            return `The lowest revenue was $${minRevenue} in ${months[minRevenueIndex]}.`;
        }

        if (lowerQuestion.includes('average revenue') || lowerQuestion.includes('mean revenue')) {
            const avgRevenue = revenueData.reduce((a, b) => a + b, 0) / revenueData.length;
            return `The average monthly revenue is $${avgRevenue.toFixed(2)}.`;
        }

        if (lowerQuestion.includes('total revenue') || lowerQuestion.includes('sum of revenue')) {
            const totalRevenue = revenueData.reduce((a, b) => a + b, 0);
            return `The total revenue across all months is $${totalRevenue}.`;
        }

        // User activity questions
        if (lowerQuestion.includes('most users') || lowerQuestion.includes('highest users') || lowerQuestion.includes('peak users')) {
            const maxUsers = Math.max(...userData);
            const maxUsersIndex = userData.indexOf(maxUsers);
            return `The highest user activity was ${maxUsers} users in ${months[maxUsersIndex]}.`;
        }

        if (lowerQuestion.includes('least users') || lowerQuestion.includes('lowest users')) {
            const minUsers = Math.min(...userData);
            const minUsersIndex = userData.indexOf(minUsers);
            return `The lowest user activity was ${minUsers} users in ${months[minUsersIndex]}.`;
        }

        if (lowerQuestion.includes('user trend') || lowerQuestion.includes('user activity trend')) {
            const firstMonth = userData[0];
            const lastMonth = userData[userData.length - 1];
            const trend = lastMonth > firstMonth ? 'increasing' : lastMonth < firstMonth ? 'decreasing' : 'stable';
            return `The overall user activity trend is ${trend} from ${months[0]} to ${months[months.length - 1]}.`;
        }

        // Comparison questions
        if (lowerQuestion.includes('compare') || lowerQuestion.includes('correlation')) {
            return `Looking at the Growth Trends chart, there appears to be some correlation between user activity and revenue. When user numbers increase, revenue often follows a similar pattern, though not always proportionally.`;
        }

        // Month-specific questions
        for (let i = 0; i < months.length; i++) {
            if (lowerQuestion.includes(months[i].toLowerCase())) {
                return `In ${months[i]}, there were ${userData[i]} active users and the revenue was $${revenueData[i]}.`;
            }
        }

        // Default response for unrecognized questions
        return "I'm not sure about that. Try asking about revenue trends, user activity, or specific months in the data.";
    };

    const handleDownload = (chartName) => {
        console.log(`Downloading ${chartName} chart data`);

        let csvContent = '';
        let filename = `${chartName.replace(/\s+/g, '_')}_data.csv`;

        // Generate CSV content based on chart type
        if (chartName === 'User Activity') {
            csvContent = 'Month,Users\n' +
                months.map((month, index) => `${month},${userData[index]}`).join('\n');
        } else if (chartName === 'Monthly Revenue') {
            csvContent = 'Month,Revenue\n' +
                months.map((month, index) => `${month},${revenueData[index]}`).join('\n');
        } else if (chartName === 'Growth Trends') {
            csvContent = 'Month,Users,Revenue\n' +
                months.map((month, index) => `${month},${userData[index]},${revenueData[index]}`).join('\n');
        }

        // Create a Blob with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const drawerContent = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div">
                    Analytics Dashboard
                </Typography>
            </Box>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <AnalyticsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <UserIcon />
                    </ListItemIcon>
                    <ListItemText primary="User Management" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <HelpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Help & Support" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="back"
                        sx={{ mr: 2 }}
                        onClick={handleGoBack}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerContent}
            </Drawer>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3} direction="column">
                    {/* First Row */}
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 300,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6">
                                    User Activity
                                </Typography>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleDownload('User Activity')}
                                    aria-label="download user activity data"
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ width: '100%', height: 220 }}>
                                <LineChart
                                    series={[
                                        {
                                            data: userData,
                                            label: 'Users',
                                            color: '#8884d8',
                                        },
                                    ]}
                                    xAxis={[{ data: months, scaleType: 'band' }]}
                                    height={220}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Monthly Revenue Row */}
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 300,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6">
                                    Monthly Revenue
                                </Typography>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleDownload('Monthly Revenue')}
                                    aria-label="download monthly revenue data"
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ width: '100%', height: 220 }}>
                                <BarChart
                                    series={[
                                        {
                                            data: revenueData,
                                            label: 'Revenue',
                                            color: '#82ca9d',
                                        },
                                    ]}
                                    xAxis={[{ data: months, scaleType: 'band' }]}
                                    height={220}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Growth Trends Row */}
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 300,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6">
                                    Growth Trends
                                </Typography>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleDownload('Growth Trends')}
                                    aria-label="download growth trends data"
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ width: '100%', height: 220 }}>
                                <LineChart
                                    series={[
                                        {
                                            data: userData,
                                            label: 'Users',
                                            color: '#8884d8',
                                            area: true,
                                        },
                                        {
                                            data: revenueData,
                                            label: 'Revenue',
                                            color: '#82ca9d',
                                            area: true,
                                        },
                                    ]}
                                    xAxis={[{ data: months, scaleType: 'band' }]}
                                    height={220}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Chat Bot Floating Button */}
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000
                }}
                onClick={toggleChat}
            >
                {chatOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {/* Chat Bot Dialog */}
            {chatOpen && (
                <Paper
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        right: 20,
                        width: 350,
                        height: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000,
                        boxShadow: 3,
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}
                >
                    {/* Chat Header */}
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <BotIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Data Assistant
                        </Typography>
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={toggleChat}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Chat Messages */}
                    <Box
                        sx={{
                            p: 2,
                            flexGrow: 1,
                            overflow: 'auto',
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        {messages.map((message) => (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 2
                                }}
                            >
                                {message.sender === 'bot' && (
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            mr: 1,
                                            bgcolor: 'primary.main'
                                        }}
                                    >
                                        <BotIcon fontSize="small" />
                                    </Avatar>
                                )}
                                <Chip
                                    label={message.text}
                                    sx={{
                                        maxWidth: '80%',
                                        p: 1,
                                        height: 'auto',
                                        '& .MuiChip-label': {
                                            whiteSpace: 'normal',
                                            p: 0.5,
                                        },
                                        backgroundColor: message.sender === 'user' ? 'primary.light' : 'white',
                                        color: message.sender === 'user' ? 'white' : 'text.primary',
                                    }}
                                />
                                {message.sender === 'user' && (
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            ml: 1,
                                            bgcolor: 'primary.dark'
                                        }}
                                    >
                                        <UserIcon fontSize="small" />
                                    </Avatar>
                                )}
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Chat Input */}
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: 'white',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            display: 'flex'
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Ask about the data..."
                            variant="outlined"
                            size="small"
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            sx={{ mr: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon />}
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                        >
                            Send
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}

export default Dashboard;
