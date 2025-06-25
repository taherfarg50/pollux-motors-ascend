import pandas as pd

# Read the CSV files
cars_df = pd.read_csv('cars.csv')
specs_df = pd.read_csv('car_specs.csv')

# Merge the dataframes on id and car_id
combined_df = pd.merge(
    cars_df, 
    specs_df,
    left_on='id',
    right_on='car_id',
    how='left'
)

# Drop duplicate columns if needed
combined_df = combined_df.drop('car_id', axis=1)

# Save to Excel
combined_df.to_excel('combined_cars_data.xlsx', index=False)

print("Combined data saved to combined_cars_data.xlsx")