import 'package:google_maps_flutter/google_maps_flutter.dart';

class ReportItem {
  final String id;
  final String title;
  final String category;
  final LatLng position;
  final String status;
  final DateTime time;

  ReportItem({
    required this.id,
    required this.title,
    required this.category,
    required this.position,
    this.status = "Pending",
    required this.time,
  });
}