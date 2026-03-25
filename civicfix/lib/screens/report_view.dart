import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../services/app_state.dart';
import '../models/report_item.dart';

class ReportView extends StatefulWidget {
  const ReportView({super.key});
  @override
  State<ReportView> createState() => _ReportViewState();
}

class _ReportViewState extends State<ReportView> {
  bool _loading = false;

  Future<void> _initiateScan() async {
    setState(() => _loading = true);
    try {
      Position pos = await Geolocator.getCurrentPosition();
      final photo = await ImagePicker().pickImage(source: ImageSource.camera);
      
      if (photo != null) {
        await Future.delayed(const Duration(seconds: 2)); // Simulate AI
        if (!mounted) return;
        
        context.read<AppState>().addReport(ReportItem(
          id: DateTime.now().toString(),
          title: "Neural Detection #${DateTime.now().millisecond}",
          category: "Infrastructure",
          position: LatLng(pos.latitude, pos.longitude),
          time: DateTime.now(),
        ));
      }
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(middle: Text("Neural Reporter")),
      child: Center(
        child: _loading 
          ? const CupertinoActivityIndicator(radius: 20) 
          : CupertinoButton.filled(onPressed: _initiateScan, child: const Text("Initialize Neural Scan")),
      ),
    );
  }
}