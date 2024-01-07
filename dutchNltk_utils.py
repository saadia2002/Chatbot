import numpy as np
import nltk
# nltk.download('punkt')
from nltk.stem.snowball import DutchStemmer  # Changed to DutchStemmer

stemmer = DutchStemmer()  # Changed to DutchStemmer

def tokenize(sentence):
    return nltk.word_tokenize(sentence)

def stem(word):
    return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentence, words):
    sentence_words = [stem(word) for word in tokenized_sentence]
    bag = np.zeros(len(words), dtype=np.float32)
    for idx, w in enumerate(words):
        if w in sentence_words: 
            bag[idx] = 1

    return bag

# test
if __name__ == "__main__":
    print(stem("levering"))  # Changed to Dutch word for "delivery"
