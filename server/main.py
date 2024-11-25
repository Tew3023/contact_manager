from flask import Flask , request , jsonify
from config import app , db
from models import Contact

@app.route('/contact', methods = ["GET"])
def get_contacts():
    contacts = Contact.query.all()
    # ค่าที่ออกมาจะเป็น phyton เราต้องเอามแปลงเป็น json
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contact" : json_contacts})

@app.route('/create_contact', methods = ["POST"])
def create_cotact():
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastName')
    email = request.json.get('email')

    if not first_name or not last_name or not email:
        return (jsonify({"message":"you must include firstNanem lastName and email"}), 400,)
    
    new_contact = Contact(first_name=firstName,last_name=lastName,email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    # 201 crate successfully    
    return jsonify({"message":"user created!"}), 201


@app.route("/update_contact/<int:user_id>",methods = ["PUT"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message":"User not found"}), 404
    
    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()

    return jsonify({"message":"User updated"}), 200


@app.route("/delete_contact/<int:user_id>", methods = ["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message":"User not found"}), 404
    
    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message":"User deleted"}), 200

if __name__ == "__main__":
    # check if there are data base or not if there are no data base it going to create it
    with app.app_context():
        db.create_all() 
    # the nwe run the server 
    app.run(debug=True)