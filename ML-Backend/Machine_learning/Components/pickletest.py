import pickle

with open(r"E:\projects\College_Project\Machine_learning\Components\artifacts\Params.pkl","rb") as fileobj:
    data=pickle.load(fileobj)
    
print(data)
    