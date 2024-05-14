import pandas as pd


def main():
    cars = pd.read_csv('car_models.csv')

    companies = pd.DataFrame(cars['Company'].unique(), columns=['name'])
    companies['id_global_brand'] = companies.index + 1


    json = companies.to_json(orient='records')
    with open('../../prisma/global_brand.json', 'w') as file:
        file.write(json)

    df = cars.copy()
    models = df.merge(companies, left_on='Company', right_on='name', how='left')
    models = models[['Model', 'id_global_brand']]
    models = models.rename(columns={'Model': 'name'})
    models['id_global_model'] = models.index + 1

    json = models.to_json(orient='records')
    with open('../../prisma/global_model.json', 'w') as file:
        file.write(json)


if __name__ == '__main__':
    main()
