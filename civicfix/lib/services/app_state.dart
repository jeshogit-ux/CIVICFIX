import 'package:flutter/foundation.dart';
import '../models/report_item.dart';

class AppState extends ChangeNotifier {
  final List<ReportItem> _reports = [];
  List<ReportItem> get reports => _reports;

  int get points => _reports.length * 50;

  void addReport(ReportItem item) {
    _reports.insert(0, item);
    notifyListeners(); // This triggers UI updates on all screens
  }
}