from openai import OpenAI  # Fixed capitalization

client = OpenAI()  # Fixed client initialization

prompt = input("> ")

messages = [
    {
        "role": "system",
        "content": "you are a helpful assistant"
    },
    {
        "role": "user",
        "content": prompt
    }
]

response = client.chat.completions.create(  # Fixed method name
    model='Meta-Llama-3.1-70B-Instruct',
    messages=messages
)

print(response.choices[0].message.content)