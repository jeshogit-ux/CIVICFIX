import 'package:flutter/cupertino.dart';

class SecurityView extends StatelessWidget {
  const SecurityView({super.key});

  @override
  Widget build(BuildContext context) {
    return const CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(middle: Text("Security Vault")),
      child: Center(child: Text("Social Engineering Education Module")),
    );
  }
}