import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import 'services/app_state.dart';
import 'screens/nexus_view.dart';
import 'screens/report_view.dart';
import 'screens/map_view.dart';
import 'screens/security_view.dart';

void main() => runApp(
  ChangeNotifierProvider(
    create: (_) => AppState(),
    child: const CupertinoApp(
      debugShowCheckedModeBanner: false,
      theme: CupertinoThemeData(
        brightness: Brightness.dark,
        primaryColor: CupertinoColors.activeBlue,
      ),
      home: MainTabScaffold(),
    ),
  ),
);

class MainTabScaffold extends StatelessWidget {
  const MainTabScaffold({super.key});

  @override
  Widget build(BuildContext context) {
    return CupertinoTabScaffold(
      tabBar: CupertinoTabBar(
        backgroundColor: CupertinoColors.black.withOpacity(0.8),
        items: const [
          BottomNavigationBarItem(icon: Icon(CupertinoIcons.layers_alt_fill), label: 'Nexus'),
          BottomNavigationBarItem(icon: Icon(CupertinoIcons.camera_fill), label: 'Scan'),
          BottomNavigationBarItem(icon: Icon(CupertinoIcons.map_fill), label: 'Radar'),
          BottomNavigationBarItem(icon: Icon(CupertinoIcons.shield_fill), label: 'Security'),
        ],
      ),
      tabBuilder: (context, index) {
        final views = [
          const NexusView(),
          const ReportView(),
          const MapView(),
          const SecurityView(),
        ];
        return views[index];
      },
    );
  }
}