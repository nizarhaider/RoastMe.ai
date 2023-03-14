![RoastMe](https://github.com/nizarhaider/RoastMe.ai/blob/prod/static/roastme.gif)

# RoastMe
RoastMe is a Flask application that utilizes machine learning to generate roasts based on a selfie provided by the user. The application is deployed on Google Cloud Run and is continuously built and deployed using Google Cloud Build and Google Container Registry.

## Features
- Accepts a selfie as input and generates a personalized roast
- Trained on 1000 posts from the subreddit r/RoastMe
- Continuous Deployment through Google Cloud Build and Google Container Registry
## Usage

1. Clone the repository

  `git clone https://github.com/<your-github-username>/roastbot.git`

2. Navigate to the directory

  `cd roastbot`

3. Start the application

  `python3 app.py`

## Disclaimer
Please note that the roasts generated by the application may be harsh and offensive in nature. Use at your own discretion.

Contributing
Contributions are highly welcomed and appreciated. To contribute, please fork the repository, make your changes and create a pull request.

## Future plans
Increase the training data from 1000 to 10000 posts from r/RoastMe for more accurate and relevant results.
Improve the model's performance and accuracy.
