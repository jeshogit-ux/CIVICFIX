import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import 'package:intl/intl.dart';

class NexusView extends StatelessWidget {
  const NexusView({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return CupertinoPageScaffold(
      child: CustomScrollView(
        slivers: [
          const CupertinoSliverNavigationBar(largeTitle: Text("City Nexus")),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStatCard("Civic Points", "${state.points} CP"),
                  const SizedBox(height: 20),
                  const Text(
                    "Recent Activity",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  ...state.reports.map(
                    (r) => CupertinoListTile(
                      title: Text(r.title),
                      subtitle: Text(
                        "${r.category} • ${DateFormat.jm().format(r.time)}",
                      ),
                      trailing: const Icon(CupertinoIcons.right_chevron),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: CupertinoColors.systemGrey6.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 18)),
          Text(
            value,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: CupertinoColors.activeBlue,
            ),
          ),
        ],
      ),
    );
  }
}
