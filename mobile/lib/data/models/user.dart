import 'base_model.dart';

class User extends BaseModel {
  final String email;
  final String password;
  final String? fullName;
  final String? phoneNumber;
  final String? profilePicture;
  final List<Object>? takenCourses;
  final List<Object>? currentCourses;
  final bool verified;

  User({
    String? id,
    required this.email,
    required this.password,
    this.fullName,
    this.phoneNumber,
    this.profilePicture,
    this.takenCourses,
    this.currentCourses,
    this.verified = false,
  }) : super(id);

  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'password': password,
      'fullName': fullName,
      'phoneNumber': phoneNumber,
      'profilePicture': profilePicture,
      'takenCourses': takenCourses,
      'currentCourses': currentCourses,
      'verified': verified,
    };
  }

  factory User.fromJson(Map<String, dynamic> data) => User(
        id: data['_id'],
        email: data['email'],
        password: data['password'],
        fullName: data['fullName'],
        phoneNumber: data['phoneNumber'],
        takenCourses: List.from(
          data['takenCourses'],
        ),
        currentCourses: List.from(
          data['currentCourses'],
        ),
        verified: data['verified'],
        profilePicture: data['profilePicture'],
      );
}
