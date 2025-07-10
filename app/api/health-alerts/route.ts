import { NextResponse } from 'next/server';

// NewsAPI Configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY!; // Get from newsapi.org
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// WHO COVID-19 API
const WHO_API_URL = 'https://covid19.who.int/WHO-COVID-19-global-data.csv';

interface HealthAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  source?: string;
  url?: string;
  publishedAt?: string;
  category?: string;
}

// Fallback data in case external APIs fail
const fallbackAlerts: HealthAlert[] = [
  {
    id: 'tip-1',
    type: 'info',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain good health.',
    icon: 'droplets',
    color: 'blue-500',
    category: 'Health Tip'
  },
  {
    id: 'tip-2',
    type: 'info',
    title: 'Regular Exercise',
    description: 'Aim for 30 minutes of moderate exercise most days of the week.',
    icon: 'heart',
    color: 'green-500',
    category: 'Health Tip'
  },
  {
    id: 'tip-3',
    type: 'info',
    title: 'Balanced Diet',
    description: 'Include fruits, vegetables, and whole grains in your daily diet.',
    icon: 'pill',
    color: 'yellow-500',
    category: 'Health Tip'
  },
  {
    id: 'alert-1',
    type: 'warning',
    title: 'Seasonal Flu Alert',
    description: 'Flu season is approaching. Get your flu shot to protect yourself and others.',
    icon: 'alert-triangle',
    color: 'red-500',
    category: 'Health Alert'
  }
];

async function fetchHealthNews(): Promise<HealthAlert[]> {
  try {
    // Fetch multiple health-related topics
    const topics = [
      'healthcare',
      'medical research',
      'covid-19',
      'vaccination',
      'mental health',
      'nutrition',
      'fitness',
      'public health'
    ];

    const alerts: HealthAlert[] = [];

    // Fetch news for each topic
    for (const topic of topics) {
      const response = await fetch(
        `${NEWS_API_URL}?q=${encodeURIComponent(topic)}&language=en&sortBy=publishedAt&pageSize=2&apiKey=${NEWS_API_KEY}`
      );

      if (!response.ok) {
        console.error(`Failed to fetch news for topic: ${topic}`);
        continue;
      }

      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        const topicAlerts = data.articles.map((article: any) => ({
          id: `news-${Date.now()}-${Math.random()}`,
          type: 'info',
          title: article.title,
          description: article.description || 'Click to read more about this health update.',
          icon: getIconForTopic(topic),
          color: getColorForTopic(topic),
          source: article.source.name,
          url: article.url,
          publishedAt: article.publishedAt,
          category: formatTopic(topic)
        }));

        alerts.push(...topicAlerts);
      }
    }

    // Sort by date and remove duplicates
    const uniqueAlerts = removeDuplicateAlerts(alerts);
    return uniqueAlerts.slice(0, 10); // Return top 10 most recent alerts

  } catch (error) {
    console.error('Error fetching health news:', error);
    return [];
  }
}

function getIconForTopic(topic: string): string {
  switch (topic.toLowerCase()) {
    case 'healthcare':
      return 'stethoscope';
    case 'medical research':
      return 'microscope';
    case 'covid-19':
      return 'virus';
    case 'vaccination':
      return 'syringe';
    case 'mental health':
      return 'brain';
    case 'nutrition':
      return 'apple';
    case 'fitness':
      return 'dumbbell';
    case 'public health':
      return 'users';
    default:
      return 'newspaper';
  }
}

function getColorForTopic(topic: string): string {
  switch (topic.toLowerCase()) {
    case 'healthcare':
      return 'blue-500';
    case 'medical research':
      return 'purple-500';
    case 'covid-19':
      return 'red-500';
    case 'vaccination':
      return 'green-500';
    case 'mental health':
      return 'pink-500';
    case 'nutrition':
      return 'yellow-500';
    case 'fitness':
      return 'orange-500';
    case 'public health':
      return 'indigo-500';
    default:
      return 'gray-500';
  }
}

function formatTopic(topic: string): string {
  return topic
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function removeDuplicateAlerts(alerts: HealthAlert[]): HealthAlert[] {
  const seen = new Set();
  return alerts.filter(alert => {
    const duplicate = seen.has(alert.title);
    seen.add(alert.title);
    return !duplicate;
  });
}

async function fetchDiseaseAlerts(): Promise<HealthAlert[]> {
  try {
    const response = await fetch('https://disease.sh/v3/covid-19/countries/india');
    if (!response.ok) {
      throw new Error('Failed to fetch disease data');
    }

    const data = await response.json();
    const alerts: HealthAlert[] = [];

    // Add COVID-19 alert if cases are high
    if (data.todayCases > 1000) {
      alerts.push({
        id: `covid-${Date.now()}`,
        type: 'warning',
        title: 'COVID-19 Alert',
        description: `There have been ${data.todayCases} new cases reported today. Please follow safety guidelines.`,
        icon: 'alert-triangle',
        color: 'red-500',
        source: 'WHO',
        publishedAt: new Date().toISOString(),
        category: 'Disease Alert'
      });
    }

    return alerts;
  } catch (error) {
    console.error('Error fetching disease alerts:', error);
    return [];
  }
}

async function fetchHealthTips(): Promise<HealthAlert[]> {
  // This is a static list of health tips that could be fetched from an API
  const healthTips = [
    {
      id: `tip-${Date.now()}-1`,
      type: 'info',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily to maintain good health.',
      icon: 'droplets',
      color: 'blue-500',
      category: 'Health Tip'
    },
    {
      id: `tip-${Date.now()}-2`,
      type: 'info',
      title: 'Regular Exercise',
      description: 'Aim for 30 minutes of moderate exercise most days of the week.',
      icon: 'heart',
      color: 'green-500',
      category: 'Health Tip'
    },
    {
      id: `tip-${Date.now()}-3`,
      type: 'info',
      title: 'Balanced Diet',
      description: 'Include fruits, vegetables, and whole grains in your daily diet.',
      icon: 'apple',
      color: 'yellow-500',
      category: 'Health Tip'
    }
  ];
  return healthTips;
}

export async function GET() {
  try {
    // Try to fetch health news from NewsAPI
    const newsAlerts = await fetchHealthNews();
    let alerts = newsAlerts;

    // If NewsAPI fails or returns nothing, fall back to static tips
    if (!alerts || alerts.length === 0) {
      alerts = fallbackAlerts;
    }

    return NextResponse.json({
      alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health alerts API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch health data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
// ...existing code...
function getIconForType(type: string): string {
  switch (type?.toLowerCase()) {
    case 'emergency':
    case 'critical':
      return 'alert-triangle';
    case 'warning':
      return 'alert-triangle';
    case 'health':
      return 'stethoscope';
    case 'vaccination':
      return 'pill';
    case 'weather':
      return 'sun';
    default:
      return 'info';
  }
}

function getColorForType(type: string): string {
  switch (type?.toLowerCase()) {
    case 'emergency':
    case 'critical':
      return 'red-500';
    case 'warning':
      return 'yellow-500';
    case 'health':
      return 'green-500';
    case 'vaccination':
      return 'blue-500';
    case 'weather':
      return 'orange-500';
    default:
      return 'gray-500';
  }
} 