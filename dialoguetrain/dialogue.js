require('dotenv').config();

const dialogflow = require('@google-cloud/dialogflow');
const projectId = process.env.proj_id;
const intentsClient = new dialogflow.IntentsClient();

async function createIntent() {
    const agentPath = intentsClient.projectAgentPath(projectId);

    const trainingPhrases = [
        'Add a new work detail',
        'I need to add a work detail',
        'Please add a work detail for me',
        'I want to add work details',
        'Enter new work details',
        'Record work details'
    ].map(phrase => ({
        type: 'EXAMPLE',
        parts: [{ text: phrase }]
    }));

    const messageTexts = [
        'The work details have been added successfully.',
        'Work ID: $work_id, Work Name: $work_name, Work Duration: $work_duration has been recorded.',
        'I\'ve recorded the work details as: ID $work_id, Name $work_name, Duration $work_duration.'
    ];
    const messages = [{
        text: { text: messageTexts }
    }];

    const intent = {
        displayName: 'AddWorkDetailsHR',
        trainingPhrases: trainingPhrases,
        messages: messages,
        webhookState: 'WEBHOOK_STATE_ENABLED',
        parameters: [
            {
                displayName: 'work_id',
                entityTypeDisplayName: '@sys.number',
                mandatory: true,
                prompts: [
                    'What is the work ID?',
                    'Please provide the work ID.',
                    'Can you tell me the work ID?'
                ]
            },
            {
                displayName: 'work_name',
                entityTypeDisplayName: '@sys.any',
                mandatory: true,
                prompts: [
                    'What is the name of the work?',
                    'Please provide the work name.',
                    'Can you tell me the work name?'
                ]
            },
            {
                displayName: 'work_duration',
                entityTypeDisplayName: '@sys.duration',
                mandatory: true,
                prompts: [
                    'What is the duration of the work?',
                    'Please provide the work duration.',
                    'Can you tell me the work duration?'
                ]
            }
        ]
    };

    const request = {
        parent: agentPath,
        intent: intent
    };

    const [response] = await intentsClient.createIntent(request);
    console.log(`Intent created: ${response.name}`);
}

createIntent().catch(console.error);