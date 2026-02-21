import { ChatCompletionTool } from 'openai/resources/chat/completions';

export const TOOLS: ChatCompletionTool[] = [
    {
        type: 'function',
        function: {
            name: 'log_steps',
            description: 'Record the number of steps taken for a date.',
            parameters: {
                type: 'object',
                properties: {
                    steps: { type: 'number' },
                    date: { type: 'string', description: 'YYYY-MM-DD format. Defaults to today.' }
                },
                required: ['steps']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'log_sleep',
            description: 'Record hours of sleep for a date.',
            parameters: {
                type: 'object',
                properties: {
                    hours: { type: 'number' },
                    date: { type: 'string', description: 'YYYY-MM-DD format. Defaults to today.' }
                },
                required: ['hours']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'log_weight',
            description: 'Record current body weight.',
            parameters: {
                type: 'object',
                properties: {
                    weight_kg: { type: 'number' },
                    date: { type: 'string', description: 'YYYY-MM-DD format. Defaults to today.' }
                },
                required: ['weight_kg']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'log_meal_text',
            description: 'Log a meal based on text description.',
            parameters: {
                type: 'object',
                properties: {
                    description: { type: 'string' },
                    date: { type: 'string', description: 'YYYY-MM-DD format.' }
                },
                required: ['description']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_summary',
            description: 'Retrieve statistical summary and chart data for a date range.',
            parameters: {
                type: 'object',
                properties: {
                    range_days: { type: 'number', description: 'Days to look back (7, 14, 30).' }
                },
                required: ['range_days']
            }
        }
    }
];
