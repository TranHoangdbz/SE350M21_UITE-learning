abstract class BaseModel {
  String? id;
  BaseModel(this.id);

  Map<String, dynamic> toJson() {
    return {};
  }
}
