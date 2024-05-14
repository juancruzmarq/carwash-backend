import pandas as pd

def main():
    cars = pd.read_csv('car_models.csv')
    companies = cars['Company'].unique()
    models = cars['Model'].unique()

    print('Companies:', companies)
    print('Models:', models)

    print('Number of companies:', len(companies))
    print('Number of models:', len(models))

    

if __name__ == '__main__':
    main()