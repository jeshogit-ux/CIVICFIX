import 'package:flutter/cupertino.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';

class MapView extends StatelessWidget {
  const MapView({super.key});

  @override
  Widget build(BuildContext context) {
    final reports = context.watch<AppState>().reports;

    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(middle: Text("Bounty Radar")),
      child: GoogleMap(
        initialCameraPosition: const CameraPosition(target: LatLng(0, 0), zoom: 2),
        myLocationEnabled: true,
        markers: reports.map((r) => Marker(
          markerId: MarkerId(r.id),
          position: r.position,
          infoWindow: InfoWindow(title: r.title, snippet: r.status),
        )).toSet(),
      ),
    );
  }
}