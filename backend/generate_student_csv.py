import csv
import random
from faker import Faker
import os

fake = Faker('en_IN') # Indian names

def generate_csv(num_records=4000, output_file="d:/raspp - Copy/docs/student_data.csv"):
    headers = [
        "student_id", "name", "branch", "current_semester", "section", 
        "avg_score", "attendance_rate", "marks_std_dev", "total_absences", 
        "subject_count", "consistency_score", "improvement_rate"
    ]
    
    branches = ["CSE", "ECE", "MECH", "CIVIL", "IT"]
    sections = ["A", "B", "C"]
    
    print(f"Generating {num_records} records to {output_file}...")
    
    with open(output_file, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        
        for i in range(1, num_records + 1):
            # Basic Info
            branch = random.choice(branches)
            semester = random.randint(1, 8)
            year = 2020 + (8 - semester) // 2 # Rough year estimate
            student_id = f"{branch}{year}{i:04d}"
            name = fake.name()
            section = random.choice(sections)
            
            # Profiles
            profile_type = random.choices(
                ["high", "avg", "low", "random"], 
                weights=[20, 50, 20, 10], 
                k=1
            )[0]
            
            if profile_type == "high":
                avg_score = random.uniform(75, 98)
                attendance = random.uniform(85, 100)
                std_dev = random.uniform(2, 8) # Consistent
            elif profile_type == "avg":
                avg_score = random.uniform(50, 75)
                attendance = random.uniform(60, 90)
                std_dev = random.uniform(5, 15)
            elif profile_type == "low":
                avg_score = random.uniform(20, 50)
                attendance = random.uniform(30, 65)
                std_dev = random.uniform(5, 20)
            else: # Random/Outlier
                avg_score = random.uniform(20, 95)
                attendance = random.uniform(30, 100)
                std_dev = random.uniform(2, 25)
                
            # Derived metrics
            total_absences = int((100 - attendance) * 0.9) # Approx 90 days
            consistency = max(0, 100 - std_dev)
            improvement = random.uniform(-5, 5) # Slope
            subject_count = random.randint(5, 6)
            
            writer.writerow([
                student_id, name, branch, semester, section,
                round(avg_score, 2), round(attendance, 2), round(std_dev, 2),
                total_absences, subject_count, round(consistency, 2), round(improvement, 2)
            ])
            
    print("Done!")

if __name__ == "__main__":
    os.makedirs(os.path.dirname("d:/raspp - Copy/docs/student_data.csv"), exist_ok=True)
    generate_csv()
