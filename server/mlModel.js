const tf = require('@tensorflow/tfjs-node')

// data for training
const data = [
    { availability: 'Weekdays', location: '92101', occupation: 'Student', interests: 'Food', hobbies: 'Cooking', service: 'Soup Kitchen' },
    { availability: 'Weekends', location: '90001', occupation: 'Teacher', interests: 'Art', hobbies: 'Painting', service: 'Planting Trees' },
    { availability: 'Weekdays', location: '10001', occupation: 'Technology', interests: 'Coding', hobbies: 'Gaming', service: 'Beach Cleanup' },
    { availability: 'Weekends', location: '30301', occupation: 'Music', interests: 'Instruments', hobbies: 'Guitar', service: 'Hospital Visits' },
    { availability: 'Weekdays', location: '60601', occupation: 'Business', interests: 'Finance', hobbies: 'Reading', service: 'Soup Kitchen' },
    { availability: 'Weekends', location: '75201', occupation: 'Medicine', interests: 'Health', hobbies: 'Running', service: 'Hospital Visits' },
    { availability: 'Weekdays', location: '94101', occupation: 'Culinary', interests: 'Cooking', hobbies: 'Baking', service: 'Soup Kitchen' }
];

// encoding the data
const availabilityEncoding = { 'Weekdays': 0, 'Weekends': 1 };
const occupationEncoding = { 'Student': 0, 'Teacher': 1, 'Technology': 2, 'Music': 3, 'Business': 4, 'Medicine': 5, 'Culinary': 6 };
const interestsEncoding = { 'Food': 0, 'Art': 1, 'Coding': 2, 'Instruments': 3, 'Finance': 4, 'Health': 5, 'Cooking': 6 };
const hobbiesEncoding = { 'Cooking': 0, 'Painting': 1, 'Gaming': 2, 'Guitar': 3, 'Reading': 4, 'Running': 5, 'Baking': 6 };
const serviceEncoding = { 'Soup Kitchen': 0, 'Planting Trees': 1, 'Beach Cleanup': 2, 'Hospital Visits': 3, 'Animal Shelter': 4 };

const normalize = (value, min, max) => (value - min) / (max - min);
const minZipCode = Math.min(...data.map(item => parseInt(item.location)));
const maxZipCode = Math.max(...data.map(item => parseInt(item.location)));

const encodedData = data.map(item => ({
    input: [
        availabilityEncoding[item.availability],
        normalize(parseInt(item.location), minZipCode, maxZipCode),
        occupationEncoding[item.occupation],
        interestsEncoding[item.interests],
        hobbiesEncoding[item.hobbies]
    ],
    label: serviceEncoding[item.service]
}));

// tensor2d -- 2-dimensional tensor like a matrix -- represents the inputs
// oneHot -- will convert the sevice types into a "one-hot" encoded format
const X = tf.tensor2d(encodedData.map(d => d.input));
const y = tf.oneHot(encodedData.map(d => d.label), 5); // 5 is the number of distinct services

const model = tf.sequential();
model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [X.shape[1]] }));
model.add(tf.layers.dense({ units: 5, activation: 'softmax' }));

// want to configure model for training
// 'adam' minimuzes the loss function - chose it bc common and fast
// 'categoricalCrossentropy' -- multi-class classification
// 'accuracy' -- how we measure performance
model.compile({
    optimizer: tf.train.adam(0.001), // Use a lower learning rate
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
});

// train and save to a file
(async () => {
    await model.fit(X, y, {
        // epochs is number of iterations
        epochs: 50,
        // 4 samples processed at a time
        batchSize: 4,
        callbacks: { onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs.loss}`) }
    });

    await model.save('file://./model');
    console.log('model success!');
})();